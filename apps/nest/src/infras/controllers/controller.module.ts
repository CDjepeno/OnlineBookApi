import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { AwsS3Client } from '../clients/aws/aws-s3.client';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';
import { UsecaseProxyModule } from '../usecase-proxy/usecase-proxy.module';
import { AddBookController } from './book/addBook/addBook.controller';
import { DeleteBookController } from './book/deleteBook/deleteBook.controller';
import { GetAllBookController } from './book/getAllBook/getAllBook.controller';
import { GetBookController } from './book/getBook/getBook.controller';
import { GetBookByUserController } from './book/getBookByUser/getBookByUser.controller';
import { UpdateBookController } from './book/updateBook/updateBook.controller';
import { AddBookingController } from './booking/addBookingController/addBooking.controller';
import { AddUserController } from './user/addUserController/addUser.controller';
import { GoogleLoginController } from './user/authController/login-google.controller';
import { LoginController } from './user/authController/login.controller';
import { GetCurrentUserController } from './user/getCurrentUser/getCurrentUser.controller';
import { GetUserByIdController } from './user/getUserById/getUserById.controller';
import { GetBookingDatesByBookIdController } from './booking/getBookingDatesByBookIdController/getBookingDatesByBookId.controller';
import { GetBookByNameController } from './book/getBookByName/getBookByName.controller';
import { GetBookingsByUserController } from './booking/getBookingsByUserController/getBookingsByUser.controller';
import { AddContactController } from './contact/addContact/addContact.controller';

@Module({
  imports: [
    UsecaseProxyModule.register(),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [
    AddUserController,
    LoginController,
    GoogleLoginController,
    GetCurrentUserController,
    GetUserByIdController,

    AddBookController,
    GetAllBookController,
    GetBookController,
    GetBookByUserController,
    GetBookByNameController,
    UpdateBookController,
    DeleteBookController,

    AddBookingController,
    GetBookingDatesByBookIdController,
    GetBookingsByUserController,
    
    AddContactController,
  ],
  providers: [JwtAuthGuard, GoogleAuthGuard, JwtService, AwsS3Client],
})
export class ControllerModule {}
