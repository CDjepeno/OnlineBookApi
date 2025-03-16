import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/infras/models/book.model';
import { Booking } from 'src/infras/models/booking.model';
import { Contact } from 'src/infras/models/contact.model';
import { User } from 'src/infras/models/user.model';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST') || "mysql_db",
        port: +configService.get('DB_PORT') || 3306,
        username: configService.get('DB_USERNAME') || "root",
        password: configService.get('DB_PASSWORD') || "Dulonx95",
        database: configService.get('DB_NAME') || "book_db",
        entities: [User, Book, Booking, Contact],
        // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class ConfigTypeOrmModule {}
