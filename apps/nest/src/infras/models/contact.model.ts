import { IsEmail, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsString()
  name!: string;

  @Column()
  @IsString()
  message!: string;

  @Column()
  @IsEmail()
  email!: string;
}