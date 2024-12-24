import { AddBookUseCase } from 'src/application/usecases/book/addBook/addBook.usecase';
import { DeleteBookUsecase } from 'src/application/usecases/book/deleteBook/deleteBook.usecase';
import { GetAllBookUsecase } from 'src/application/usecases/book/getAllBook/getAllBook.usecase';
import { GetBookUsecase } from 'src/application/usecases/book/getBook/getBook.usecase';
import { GetBookByNameUsecase } from 'src/application/usecases/book/getBookByName/getBookByName.usecase';
import { GetBooksByUserUsecase } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.usecase';
import { UpdateBookUseCase } from 'src/application/usecases/book/updateBook/updateBook.usecase';
import { BookingBookUseCase } from 'src/application/usecases/booking/bookingBook/bookingBook.usecase';
import { GetBookingsBookUseCase } from 'src/application/usecases/booking/getBookingsBook/getBookingsBook.usecase';
import { GetBookingsUserUseCase } from 'src/application/usecases/booking/getBookingsUser/getBookingsUser.usecase';
import { AddUserUseCase } from 'src/application/usecases/user/adduser/add.user.usecase';
import { GetCurrentUserUseCase } from 'src/application/usecases/user/auth/get.current.user.usecase';
import { LoginUserUseCase } from 'src/application/usecases/user/auth/login/login.user.usecase';
import { LogoutUserUseCase } from 'src/application/usecases/user/auth/logout/logout.user.usecase';
import { AwsS3Client } from 'src/infras/clients/aws/aws-s3.client';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';
import { BookRepositoryTyperom } from '../services/book.repository.typeorm';
import { BookingRepositoryTypeorm } from '../services/booking.repository.typeorm';
import { UserRepositoryTyperom } from '../services/user.repository.typeorm';
import { UseCaseProxy } from './usecase-proxy';
import { RefreshTokenUseCase } from 'src/application/usecases/user/auth/refreshToken/refresh.token.usecase';

export enum UsecaseProxyEnum {
  CREATE_USER_USECASE_PROXY = 'createUserUsecaseProxy',
  LOGIN_USER_USECASE_PROXY = 'loginUserUseCaseProxy',
  LOGOUT_USER_USECASE_PROXY = 'logoutUserUseCaseProxy',
  REFRESH_TOKEN_USECASE_PROXY = 'refreshTokenUseCaseProxy',
  BOOKING_BOOK_USECASE_PROXY = 'BookingBookUsecaseProxy',
  ADD_BOOK_USECASE_PROXY = 'addBookUsecaseProxy',
  

  GET_CURRENT_USER_USECASE_PROXY = 'getCurrentUserUseCaseProxy',
  GET_ALL_BOOK_USECASE_PROXY = 'getAllBookUsecaseProxy',
  GET_BOOKS_BY_USER_USECASE_PROXY = 'getBookByUserUsecaseProxy',
  GET_BOOK_USECASE_PROXY = 'getBookUsecaseProxy',
  GET_BOOK_BY_NAME_USECASE_PROXY = 'getBookByNameUsecaseProxy',
  GET_BOOKINGS_BOOK_USECASE_PROXY = 'getBookingBookUsecaseProxy',
  GET_BOOKINGS_USER_USECASE_PROXY = 'getBookingUserUsecaseProxy',

  DELETE_BOOK_USECASE_PROXY = 'deleteBookUsecaseProxy',
  UPDATE_BOOK_USECASE_PROXY = 'updateBookUsecaseProxy',
}

export const useCasesConfig = [
  {
    inject: [UserRepositoryTyperom, NodemailerClient],
    provide: UsecaseProxyEnum.CREATE_USER_USECASE_PROXY,
    useFactory: (
      userRepository: UserRepositoryTyperom,
      nodemailerClient: NodemailerClient,
    ) => new UseCaseProxy(new AddUserUseCase(userRepository, nodemailerClient)),
  },
  {
    inject: [UserRepositoryTyperom],
    provide: UsecaseProxyEnum.LOGIN_USER_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTyperom) =>
      new UseCaseProxy(new LoginUserUseCase(userRepository)),
  },
  {
    inject: [UserRepositoryTyperom],
    provide: UsecaseProxyEnum.GET_CURRENT_USER_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTyperom) =>
      new UseCaseProxy(new GetCurrentUserUseCase(userRepository)),
  },
  {
    inject: [BookRepositoryTyperom, AwsS3Client],
    provide: UsecaseProxyEnum.ADD_BOOK_USECASE_PROXY,
    useFactory: (
      bookRepository: BookRepositoryTyperom,
      awsS3Client: AwsS3Client,
    ) => new UseCaseProxy(new AddBookUseCase(bookRepository, awsS3Client)),
  },
  {
    inject: [BookRepositoryTyperom],
    provide: UsecaseProxyEnum.GET_ALL_BOOK_USECASE_PROXY,
    useFactory: (bookRepository: BookRepositoryTyperom) =>
      new UseCaseProxy(new GetAllBookUsecase(bookRepository)),
  },
  {
    inject: [BookRepositoryTyperom],
    provide: UsecaseProxyEnum.GET_BOOKS_BY_USER_USECASE_PROXY,
    useFactory: (bookRepository: BookRepositoryTyperom) =>
      new UseCaseProxy(new GetBooksByUserUsecase(bookRepository)),
  },
  {
    inject: [BookRepositoryTyperom],
    provide: UsecaseProxyEnum.GET_BOOK_USECASE_PROXY,
    useFactory: (bookRepository: BookRepositoryTyperom) =>
      new UseCaseProxy(new GetBookUsecase(bookRepository)),
  },
  {
    inject: [BookRepositoryTyperom],
    provide: UsecaseProxyEnum.DELETE_BOOK_USECASE_PROXY,
    useFactory: (bookRepository: BookRepositoryTyperom) =>
      new UseCaseProxy(new DeleteBookUsecase(bookRepository)),
  },
  {
    inject: [BookRepositoryTyperom, AwsS3Client],
    provide: UsecaseProxyEnum.UPDATE_BOOK_USECASE_PROXY,
    useFactory: (
      bookRepository: BookRepositoryTyperom,
      awsS3Client: AwsS3Client,
    ) => new UseCaseProxy(new UpdateBookUseCase(bookRepository, awsS3Client)),
  },
  {
    inject: [BookingRepositoryTypeorm],
    provide: UsecaseProxyEnum.BOOKING_BOOK_USECASE_PROXY,
    useFactory: (bookingRepository: BookingRepositoryTypeorm) =>
      new UseCaseProxy(new BookingBookUseCase(bookingRepository)),
  },
  {
    inject: [BookingRepositoryTypeorm],
    provide: UsecaseProxyEnum.GET_BOOKINGS_BOOK_USECASE_PROXY,
    useFactory: (bookingRepository: BookingRepositoryTypeorm) =>
      new UseCaseProxy(new GetBookingsBookUseCase(bookingRepository)),
  },
  {
    inject: [BookRepositoryTyperom],
    provide: UsecaseProxyEnum.GET_BOOK_BY_NAME_USECASE_PROXY,
    useFactory: (bookRepository: BookRepositoryTyperom) =>
      new UseCaseProxy(new GetBookByNameUsecase(bookRepository)),
  },
  {
    inject: [UserRepositoryTyperom],
    provide: UsecaseProxyEnum.LOGOUT_USER_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTyperom) =>
      new UseCaseProxy(new LogoutUserUseCase(userRepository)),
  },
  {
    inject: [UserRepositoryTyperom],
    provide: UsecaseProxyEnum.REFRESH_TOKEN_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTyperom) =>
      new UseCaseProxy(new RefreshTokenUseCase(userRepository)),
  },
  {
    inject: [BookingRepositoryTypeorm],
    provide: UsecaseProxyEnum.GET_BOOKINGS_USER_USECASE_PROXY,
    useFactory: (bookingRepository: BookingRepositoryTypeorm) =>
      new UseCaseProxy(new GetBookingsUserUseCase(bookingRepository)),
  },
];

export function generateProviders() {
  return useCasesConfig.map((useCase) => ({
    provide: useCase.provide,
    inject: useCase.inject,
    useFactory: useCase.useFactory,
  }));
}
