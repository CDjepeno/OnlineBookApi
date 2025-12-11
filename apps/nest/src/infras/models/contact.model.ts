import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsEmail()
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @Column()
  @IsString()
  message: string;
}
