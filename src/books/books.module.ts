import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BooksResolver } from './books.resolver';

@Module({
  controllers: [BooksController],
  providers: [BooksService, BooksResolver],
  exports: [BooksService],
})
export class BooksModule {}
