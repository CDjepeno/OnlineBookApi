import { DynamicModule, Module } from '@nestjs/common';

import { AddBookUseCase } from 'src/domaine/book/usecases/addBook/addBook.usecase';
import { DeleteBookUsecase } from 'src/domaine/book/usecases/deleteBook/deleteBook.usecase';
import { GetAllBookUsecase } from 'src/domaine/book/usecases/getAllBook/getAllBook.usecase';
import { GetBookUsecase } from 'src/domaine/book/usecases/getBook/getBook.usecase';
import { GetBookByNameUsecase } from 'src/domaine/book/usecases/getBookByName/getBookByName.usecase';
import { GetBooksByUserUsecase } from 'src/domaine/book/usecases/getBooksByUser/getBooksByUser.usecase';
import { UpdateBookUseCase } from 'src/domaine/book/usecases/updateBook/updateBook.usecase';
import { AddBookingUseCase } from 'src/domaine/booking/usecases/addBooking/addBooking.usecase';
import { GetBookingDatesByBookIdUseCase } from 'src/domaine/booking/usecases/getBookingDatesByBookId/getBookingDatesByBookId.usecase';
import { GetBookingsByUserUseCase } from 'src/domaine/booking/usecases/getBookingsByUser/getBookingsByUser.usecase';
import { AddContactUseCase } from 'src/domaine/contact/usecases/addContact/addContact.usecase';
import { AddUserUseCase } from 'src/domaine/user/usecases/adduser/add.user.usecase';
import { GetCurrentUserUseCase } from 'src/domaine/user/usecases/auth/get.current.user.usecase';
import { LoginUserUseCase } from 'src/domaine/user/usecases/getuser/login.user.usecase';
import { LoginGoogleUseCase } from 'src/domaine/user/usecases/google/login.google.usecase';
import { UpdateUserUseCase } from 'src/domaine/user/usecases/updateuser/update.user.usecase';
import { AwsS3Client } from '../clients/aws/aws-s3.client';
import { AwsS3Module } from '../clients/aws/aws-s3.module';
import NodemailerClient from '../clients/nodemailer/nodemailer.client';
import { NodemailerModules } from '../clients/nodemailer/nodemailer.module';
import { BookRepositoryTypeorm } from '../services/book.repository.typeorm';
import { BookingRepositoryTypeorm } from '../services/booking.repository.typeorm';
import { ContactRepositoryTypeorm } from '../services/contact.repository.typeorm';
import { RepositoriesModule } from '../services/repositories.module';
import { UserRepositoryTypeorm } from '../services/user.repository.typeorm';
import { UseCaseProxy } from './usecase-proxy';

@Module({
  imports: [RepositoriesModule, NodemailerModules, AwsS3Module],
})
export class UsecaseProxyModule {
  static CREATE_USER_USECASE_PROXY = 'createUserUsecaseProxy';
  static LOGIN_USER_USECASE_PROXY = 'loginUserUseCaseProxy';
  static LOGIN_GOOGLE_USECASE_PROXY = 'loginGoogleUseCaseProxy';
  static GET_CURRENT_USER_USECASE_PROXY = 'getCurrentUserUseCaseProxy';
  static UPDATE_USER_USECASE_PROXY = 'updateUserUseCaseProxy';

  static ADD_BOOK_USECASE_PROXY = 'addBookUsecaseProxy';
  static GET_ALL_BOOK_USECASE_PROXY = 'getAllBookUsecaseProxy';
  static GET_BOOKS_BY_USER_USECASE_PROXY = 'getBookByUserUsecaseProxy';
  static GET_BOOK_BY_NAME_USECASE_PROXY = 'getBookByNameUsecaseProxy';
  static GET_BOOK_USECASE_PROXY = 'getBookUsecaseProxy';
  static DELETE_BOOK_USECASE_PROXY = 'deleteBookUsecaseProxy';
  static UPDATE_BOOK_USECASE_PROXY = 'updateBookUsecaseProxy';

  static ADD_BOOKING_USECASE_PROXY = 'addBookingUsecaseProxy';
  static GET_BOOKING_DATES_BY_BOOK_ID_USECASE_PROXY =
    'getBookingDatesByBookUsecaseProxy';
  static GET_BOOKINGS_BY_USER_USECASE_PROXY = 'getBookingsByUserUsecaseProxy';

  static ADD_CONTACT_USECASE_PROXY = 'addContactUseCaseProxy';

  static register(): DynamicModule {
    return {
      module: UsecaseProxyModule,
      providers: [
        {
          inject: [UserRepositoryTypeorm, NodemailerClient],
          provide: UsecaseProxyModule.CREATE_USER_USECASE_PROXY,
          useFactory: (
            userRepository: UserRepositoryTypeorm,
            nodemailerClient: NodemailerClient,
          ) =>
            new UseCaseProxy(
              new AddUserUseCase(userRepository, nodemailerClient),
            ),
        },
        {
          inject: [UserRepositoryTypeorm],
          provide: UsecaseProxyModule.LOGIN_USER_USECASE_PROXY,
          useFactory: (userRepository: UserRepositoryTypeorm) =>
            new UseCaseProxy(new LoginUserUseCase(userRepository)),
        },
        {
          inject: [UserRepositoryTypeorm],
          provide: UsecaseProxyModule.LOGIN_GOOGLE_USECASE_PROXY,
          useFactory: (userRepository: UserRepositoryTypeorm) =>
            new UseCaseProxy(new LoginGoogleUseCase(userRepository)),
        },
        {
          inject: [UserRepositoryTypeorm],
          provide: UsecaseProxyModule.GET_CURRENT_USER_USECASE_PROXY,
          useFactory: (userRepository: UserRepositoryTypeorm) =>
            new UseCaseProxy(new GetCurrentUserUseCase(userRepository)),
        },
        {
          inject: [UserRepositoryTypeorm],
          provide: UsecaseProxyModule.UPDATE_USER_USECASE_PROXY,
          useFactory: (userRepository: UserRepositoryTypeorm) =>
            new UseCaseProxy(new UpdateUserUseCase(userRepository)),
        },
        {
          inject: [BookRepositoryTypeorm, AwsS3Client],
          provide: UsecaseProxyModule.ADD_BOOK_USECASE_PROXY,
          useFactory: (
            bookRepository: BookRepositoryTypeorm,
            awsS3Client: AwsS3Client,
          ) =>
            new UseCaseProxy(new AddBookUseCase(bookRepository, awsS3Client)),
        },
        {
          inject: [BookRepositoryTypeorm],
          provide: UsecaseProxyModule.GET_ALL_BOOK_USECASE_PROXY,
          useFactory: (bookRepository: BookRepositoryTypeorm) =>
            new UseCaseProxy(new GetAllBookUsecase(bookRepository)),
        },
        {
          inject: [BookRepositoryTypeorm],
          provide: UsecaseProxyModule.GET_BOOKS_BY_USER_USECASE_PROXY,
          useFactory: (bookRepository: BookRepositoryTypeorm) =>
            new UseCaseProxy(new GetBooksByUserUsecase(bookRepository)),
        },
        {
          inject: [BookRepositoryTypeorm],
          provide: UsecaseProxyModule.GET_BOOK_BY_NAME_USECASE_PROXY,
          useFactory: (bookRepository: BookRepositoryTypeorm) =>
            new UseCaseProxy(new GetBookByNameUsecase(bookRepository)),
        },
        {
          inject: [BookRepositoryTypeorm],
          provide: UsecaseProxyModule.GET_BOOK_USECASE_PROXY,
          useFactory: (bookRepository: BookRepositoryTypeorm) =>
            new UseCaseProxy(new GetBookUsecase(bookRepository)),
        },
        {
          inject: [BookRepositoryTypeorm],
          provide: UsecaseProxyModule.DELETE_BOOK_USECASE_PROXY,
          useFactory: (bookRepository: BookRepositoryTypeorm) =>
            new UseCaseProxy(new DeleteBookUsecase(bookRepository)),
        },
        {
          inject: [BookRepositoryTypeorm, AwsS3Client],
          provide: UsecaseProxyModule.UPDATE_BOOK_USECASE_PROXY,
          useFactory: (
            bookRepository: BookRepositoryTypeorm,
            awsS3Client: AwsS3Client,
          ) =>
            new UseCaseProxy(
              new UpdateBookUseCase(bookRepository, awsS3Client),
            ),
        },

        {
          inject: [
            BookingRepositoryTypeorm,
            UserRepositoryTypeorm,
            NodemailerClient,
          ],
          provide: UsecaseProxyModule.ADD_BOOKING_USECASE_PROXY,
          useFactory: (
            bookingRepository: BookingRepositoryTypeorm,
            userRepository: UserRepositoryTypeorm,
            nodemailerClient: NodemailerClient,
          ) =>
            new UseCaseProxy(
              new AddBookingUseCase(
                bookingRepository,
                userRepository,
                nodemailerClient,
              ),
            ),
        },
        {
          inject: [BookingRepositoryTypeorm],
          provide:
            UsecaseProxyModule.GET_BOOKING_DATES_BY_BOOK_ID_USECASE_PROXY,
          useFactory: (bookingRepository: BookingRepositoryTypeorm) =>
            new UseCaseProxy(
              new GetBookingDatesByBookIdUseCase(bookingRepository),
            ),
        },
        {
          inject: [BookingRepositoryTypeorm],
          provide: UsecaseProxyModule.GET_BOOKINGS_BY_USER_USECASE_PROXY,
          useFactory: (bookingRepository: BookingRepositoryTypeorm) =>
            new UseCaseProxy(new GetBookingsByUserUseCase(bookingRepository)),
        },

        {
          inject: [ContactRepositoryTypeorm, NodemailerClient],
          provide: UsecaseProxyModule.ADD_CONTACT_USECASE_PROXY,
          useFactory: (
            contactRepository: ContactRepositoryTypeorm,
            nodemailerClient: NodemailerClient,
          ) =>
            new UseCaseProxy(
              new AddContactUseCase(contactRepository, nodemailerClient),
            ),
        },
      ],

      exports: [
        UsecaseProxyModule.CREATE_USER_USECASE_PROXY,
        UsecaseProxyModule.LOGIN_USER_USECASE_PROXY,
        UsecaseProxyModule.LOGIN_GOOGLE_USECASE_PROXY,
        UsecaseProxyModule.GET_CURRENT_USER_USECASE_PROXY,
        UsecaseProxyModule.UPDATE_USER_USECASE_PROXY,

        UsecaseProxyModule.ADD_BOOK_USECASE_PROXY,
        UsecaseProxyModule.GET_ALL_BOOK_USECASE_PROXY,
        UsecaseProxyModule.GET_BOOKS_BY_USER_USECASE_PROXY,
        UsecaseProxyModule.GET_BOOK_BY_NAME_USECASE_PROXY,
        UsecaseProxyModule.GET_BOOK_USECASE_PROXY,
        UsecaseProxyModule.DELETE_BOOK_USECASE_PROXY,
        UsecaseProxyModule.UPDATE_BOOK_USECASE_PROXY,

        UsecaseProxyModule.ADD_BOOKING_USECASE_PROXY,
        UsecaseProxyModule.GET_BOOKING_DATES_BY_BOOK_ID_USECASE_PROXY,
        UsecaseProxyModule.GET_BOOKINGS_BY_USER_USECASE_PROXY,

        UsecaseProxyModule.ADD_CONTACT_USECASE_PROXY,
      ],
    };
  }
}
