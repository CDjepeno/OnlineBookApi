import * as bcrypt from 'bcrypt';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
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
  sexe: string;

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
  async hashPasswordBeforeInsert() {
    await this.hashPassword();
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password && !/^\$2[aby]\$.{56}$/.test(this.password)) {
      await this.hashPassword();
    }
  }

  private async hashPassword() {
    const isHashed = /^\$2[aby]\$.{56}$/.test(this.password);
    if (!isHashed) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
