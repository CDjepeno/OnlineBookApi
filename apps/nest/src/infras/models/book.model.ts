import { IsInt, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDateFormat } from '../common/decorators/is-date-format.decorator';
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
  @IsDateFormat()
  releaseAt: Date;

  @Column({ length: 512 })
  @IsString()
  coverUrl: string;

  @Column()
  @IsInt()
  userId: number;

  @ManyToOne(() => User, (user) => user.books)
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
