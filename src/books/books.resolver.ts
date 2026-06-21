import { Args, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { BookEntity } from './entities/book.entity';
import { BooksService } from './books.service';

@Resolver(() => BookEntity)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query(() => [BookEntity], { name: 'books' })
  books() {
    return this.booksService.findAll();
  }

  @Query(() => BookEntity, { name: 'book' })
  book(@Args('id', { type: () => String }, ParseUUIDPipe) id: string) {
    return this.booksService.findOne(id);
  }
}
