import * as bcrypt from 'bcrypt';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.model';
import { Booking } from './booking.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { unique: true })
  @IsEmail()
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @Column()
  @IsString()
  @Length(6, 24)
  @Matches(/^(?=.*?[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-_]).{8,}$/, {
    message:
      'Password should have 1 upper case, 1 lowercase letter, 1 number, and 1 special character.',
  })
  password: string;

  @Column()
  @IsString()
  name: string;

  @Column({ nullable: true })
  @IsString()
  refreshToken: string;

  @Column()
  @IsString()
  phone: string;

  @OneToMany(() => Book, (book) => book.user)
  books?: Book[];
  
  
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings?: Booking[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async setPassword() {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
