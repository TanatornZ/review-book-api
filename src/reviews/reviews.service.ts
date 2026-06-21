import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    const book = await this.prisma.book.findUnique({
      where: { id: createReviewDto.bookId },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.prisma.review.create({
      data: {
        bookId: createReviewDto.bookId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        userId,
      },
    });
  }

  findAll(bookId?: string) {
    return this.prisma.review.findMany({
      where: bookId ? { bookId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
    userId: string,
    role: Role,
  ) {
    await this.assertCanManageReview(id, userId, role);
    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  async remove(id: string, userId: string, role: Role) {
    await this.assertCanManageReview(id, userId, role);
    await this.prisma.review.delete({ where: { id } });
    return { deleted: true };
  }

  private async assertCanManageReview(
    reviewId: string,
    userId: string,
    role: Role,
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (role !== Role.ADMIN && review.userId !== userId) {
      throw new ForbiddenException('You cannot modify this review');
    }
  }
}
