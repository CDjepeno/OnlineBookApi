import * as bcrypt from 'bcrypt';
import {
  IsEmail,
  IsEnum,
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
import { Sexe } from 'src/domaine/enums/sexe.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { unique: true })
  @IsEmail()
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @Column({ nullable: true })
  @IsString()
  @Length(6, 24)
  @Matches(/^(?=.*?[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-_]).{8,}$/, {
    message:
      'Le mot de passe doit contenir 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.',
  })
  password: string;

  @Column()
  @IsString()
  name: string;

  @Column({ nullable: true })
  @IsString()
  phone: string;

  @Column({
    type: 'enum',
    enum: Sexe,
    nullable: true,
  })
  @IsEnum(Sexe, { message: 'Le sexe doit être homme, femme ou autre' })
  sexe: Sexe;

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async setPassword() {
    if (!this.password) return;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
