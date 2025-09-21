import { IsDateString, IsInt, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from './booking.model';
import { User } from './user.model';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  description: string;

  @Column()
  @IsString()
  author: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @IsDateString()
  releaseAt: Date;

  @Column({ length: 512 })
  @IsString()
  coverUrl: string;

  @Column()
  @IsInt()
  userId: number;

  @ManyToOne(() => User, (user) => user.books)
  user: User;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
