import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Review')
export class ReviewEntity {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  comment: string | null;

  @Field()
  userId: string;
}
