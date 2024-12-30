import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';
import { Book } from './book.model';
import { IsInt } from 'class-validator';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  startAt!: Date;

  @Column()
  endAt!: Date;

  @Column()
  @IsInt()
  userId!: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @IsInt()
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  @IsInt()
  bookId!: number;

  @ManyToOne(() => Book, (book) => book.bookings,{ nullable: false })
  @JoinColumn({ name: 'bookId' })
  book!: Book;
}
