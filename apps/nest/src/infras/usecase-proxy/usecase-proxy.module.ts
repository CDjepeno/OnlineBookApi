import { DynamicModule, Module } from '@nestjs/common';

import { AddBookUseCase } from 'src/domaine/book/usecases/addBook/addBook.usecase';
import { DeleteBookUsecase } from 'src/domaine/book/usecases/deleteBook/deleteBook.usecase';
import { GetAllBookUsecase } from 'src/domaine/book/usecases/getAllBook/getAllBook.usecase';
import { GetBookUsecase } from 'src/domaine/book/usecases/getBook/getBook.usecase';
import { GetBooksByUserUsecase } from 'src/domaine/book/usecases/getBooksByUser/getBooksByUser.usecase';
import { UpdateBookUseCase } from 'src/domaine/book/usecases/updateBook/updateBook.usecase';
import { AddUserUseCase } from 'src/domaine/user/usecases/adduser/add.user.usecase';
import { GetCurrentUserUseCase } from 'src/domaine/user/usecases/auth/get.current.user.usecase';
import { LoginUserUseCase } from 'src/domaine/user/usecases/getuser/login.user.usecase';
import { AwsS3Client } from '../clients/aws/aws-s3.client';
import { AwsS3Module } from '../clients/aws/aws-s3.module';
import NodemailerClient from '../clients/nodemailer/nodemailer.client';
import { NodemailerModules } from '../clients/nodemailer/nodemailer.module';
import { BookRepositoryTyperom } from '../services/book.repository.typeorm';
import { RepositoriesModule } from '../services/repositories.module';
import { UserRepositoryTyperom } from '../services/user.repository.typeorm';
import { UseCaseProxy } from './usecase-proxy';

@Module({
  imports: [RepositoriesModule, NodemailerModules, AwsS3Module],
})
export class UsecaseProxyModule {
  static CREATE_USER_USECASE_PROXY = 'createUserUsecaseProxy';
  static LOGIN_USER_USECASE_PROXY = 'loginUserUseCaseProxy';
  static GET_CURRENT_USER_USECASE_PROXY = 'getCurrentUserUseCaseProxy';

  static ADD_BOOK_USECASE_PROXY = 'addBookUsecaseProxy';
  static GET_ALL_BOOK_USECASE_PROXY = 'getAllBookUsecaseProxy';
  static GET_BOOKS_BY_USER_USECASE_PROXY = 'getBookByUserUsecaseProxy';
  static GET_BOOK_USECASE_PROXY = 'getBookUsecaseProxy';
  static DELETE_BOOK_USECASE_PROXY = 'deleteBookUsecaseProxy';
  static UPDATE_BOOK_USECASE_PROXY = 'updateBookUsecaseProxy';

  static register(): DynamicModule {
    return {
      module: UsecaseProxyModule,
      providers: [
        {
          inject: [UserRepositoryTyperom, NodemailerClient],
          provide: UsecaseProxyModule.CREATE_USER_USECASE_PROXY,
          useFactory: (
            userRepository: UserRepositoryTyperom,
            nodemailerClient: NodemailerClient,
          ) =>
            new UseCaseProxy(
              new AddUserUseCase(userRepository, nodemailerClient),
            ),
        },
        {
          inject: [UserRepositoryTyperom],
          provide: UsecaseProxyModule.LOGIN_USER_USECASE_PROXY,
          useFactory: (userRepository: UserRepositoryTyperom) =>
            new UseCaseProxy(new LoginUserUseCase(userRepository)),
        },
        {
          inject: [UserRepositoryTyperom],
          provide: UsecaseProxyModule.GET_CURRENT_USER_USECASE_PROXY,
          useFactory: (userRepository: UserRepositoryTyperom) =>
            new UseCaseProxy(new GetCurrentUserUseCase(userRepository)),
        },
        {
          inject: [BookRepositoryTyperom, AwsS3Client],
          provide: UsecaseProxyModule.ADD_BOOK_USECASE_PROXY,
          useFactory: (
            bookRepository: BookRepositoryTyperom,
            awsS3Client: AwsS3Client,
          ) =>
            new UseCaseProxy(new AddBookUseCase(bookRepository, awsS3Client)),
        },
        {
          inject: [BookRepositoryTyperom],
          provide: UsecaseProxyModule.GET_ALL_BOOK_USECASE_PROXY,
          useFactory: (bookRepository: BookRepositoryTyperom) =>
            new UseCaseProxy(new GetAllBookUsecase(bookRepository)),
        },
        {
          inject: [BookRepositoryTyperom],
          provide: UsecaseProxyModule.GET_BOOKS_BY_USER_USECASE_PROXY,
          useFactory: (bookRepository: BookRepositoryTyperom) =>
            new UseCaseProxy(new GetBooksByUserUsecase(bookRepository)),
        },
        {
          inject: [BookRepositoryTyperom],
          provide: UsecaseProxyModule.GET_BOOK_USECASE_PROXY,
          useFactory: (bookRepository: BookRepositoryTyperom) =>
            new UseCaseProxy(new GetBookUsecase(bookRepository)),
        },
        {
          inject: [BookRepositoryTyperom],
          provide: UsecaseProxyModule.DELETE_BOOK_USECASE_PROXY,
          useFactory: (bookRepository: BookRepositoryTyperom) =>
            new UseCaseProxy(new DeleteBookUsecase(bookRepository)),
        },
        {
          inject: [BookRepositoryTyperom, AwsS3Client],
          provide: UsecaseProxyModule.UPDATE_BOOK_USECASE_PROXY,
          useFactory: (
            bookRepository: BookRepositoryTyperom,
            awsS3Client: AwsS3Client,
          ) =>
            new UseCaseProxy(
              new UpdateBookUseCase(bookRepository, awsS3Client),
            ),
        },
      ],

      exports: [
        UsecaseProxyModule.CREATE_USER_USECASE_PROXY,
        UsecaseProxyModule.LOGIN_USER_USECASE_PROXY,
        UsecaseProxyModule.GET_CURRENT_USER_USECASE_PROXY,

        UsecaseProxyModule.ADD_BOOK_USECASE_PROXY,
        UsecaseProxyModule.GET_ALL_BOOK_USECASE_PROXY,
        UsecaseProxyModule.GET_BOOKS_BY_USER_USECASE_PROXY,
        UsecaseProxyModule.GET_BOOK_USECASE_PROXY,
        UsecaseProxyModule.DELETE_BOOK_USECASE_PROXY,
        UsecaseProxyModule.UPDATE_BOOK_USECASE_PROXY,
      ],
    };
  }
}
