import { IsDate, IsInt, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.model';
import { Booking } from './booking.model';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  description: string;

  @Column()
  @IsString()
  author: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  releaseAt: Date;

  @Column()
  @IsString()
  coverUrl: string;

  @Column()
  @IsInt()
  userId: number;

  @ManyToOne(() => User, (user) => user.books)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
  @OneToMany(() => Booking, (bookings) => bookings.book)
  bookings: Booking[];
}
