import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBookDto: CreateBookDto, createdById: string) {
    return this.prisma.book.create({
      data: {
        ...createBookDto,
        publishedAt: createBookDto.publishedAt
          ? new Date(createBookDto.publishedAt)
          : undefined,
        createdById,
      },
      include: { reviews: true },
    });
  }

  findAll() {
    return this.prisma.book.findMany({
      include: { reviews: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { reviews: true },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
    userId: string,
    role: Role,
  ) {
    await this.assertCanManageBook(id, userId, role);

    return this.prisma.book.update({
      where: { id },
      data: {
        ...updateBookDto,
        publishedAt: updateBookDto.publishedAt
          ? new Date(updateBookDto.publishedAt)
          : undefined,
      },
      include: { reviews: true },
    });
  }

  async remove(id: string, userId: string, role: Role) {
    await this.assertCanManageBook(id, userId, role);

    await this.prisma.book.delete({ where: { id } });
    return { deleted: true };
  }

  private async assertCanManageBook(
    bookId: string,
    userId: string,
    role: Role,
  ) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (role !== Role.ADMIN && book.createdById !== userId) {
      throw new ForbiddenException('You cannot modify this book');
    }
  }
}
