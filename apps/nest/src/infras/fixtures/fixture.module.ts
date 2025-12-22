import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../models/book.model';
import { Booking } from '../models/booking.model';
import { Contact } from '../models/contact.model';
import { User } from '../models/user.model';
import { FixtureService } from './fixture.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Book, Booking, Contact])],
  providers: [FixtureService],
  exports: [FixtureService],
})
export class FixtureModule {}
