import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ReviewEntity } from '../../reviews/entities/review.entity';

@ObjectType('Book')
export class BookEntity {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  authorName: string;

  @Field({ nullable: true })
  description: string | null;

  @Field({ nullable: true })
  publishedAt: Date | null;

  @Field(() => [ReviewEntity])
  reviews: ReviewEntity[];
}
