import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';

class UpdateReviewBaseDto extends PickType(CreateReviewDto, [
  'rating',
  'comment',
] as const) {}

export class UpdateReviewDto extends PartialType(UpdateReviewBaseDto) {}
