import { AddUserUseCase } from "src/application/usecases/user/adduser/add.user.usecase";
import NodemailerClient from "../clients/nodemailer/nodemailer.client";
import { UserRepositoryTyperom } from "../services/user.repository.typeorm";
import { UseCaseProxy } from "./usecase-proxy";
import { LoginUserUseCase } from "src/application/usecases/user/getuser/login.user.usecase";
import { GetCurrentUserUseCase } from "src/application/usecases/user/auth/get.current.user.usecase";
import { BookRepositoryTyperom } from "../services/book.repository.typeorm";
import { AwsS3Client } from "../clients/aws/aws-s3.client";
import { AddBookUseCase } from "src/application/usecases/book/addBook/addBook.usecase";
import { GetAllBookUsecase } from "src/application/usecases/book/getAllBook/getAllBook.usecase";
import { GetBooksByUserUsecase } from "src/application/usecases/book/getBooksByUser/getBooksByUser.usecase";
import { GetBookUsecase } from "src/application/usecases/book/getBook/getBook.usecase";
import { DeleteBookUsecase } from "src/application/usecases/book/deleteBook/deleteBook.usecase";
import { UpdateBookUseCase } from "src/application/usecases/book/updateBook/updateBook.usecase";
import { BookingRepositoryTypeorm } from "../services/booking.repository.typeorm";
import { BookingBookUseCase } from "src/application/usecases/booking/bookingBook/bookingBook.usecase";
import { GetBookingsBookUseCase } from "src/application/usecases/booking/getBookings/getBookingsBook.usecase";
import { GetBookByNameUsecase } from "src/application/usecases/book/getBookByName/getBookByName.usecase";

export enum UsecaseProxyEnum {
  CREATE_USER_USECASE_PROXY = 'createUserUsecaseProxy',
  LOGIN_USER_USECASE_PROXY = 'loginUserUseCaseProxy',
  BOOKING_BOOK_USECASE_PROXY = 'BookingBookUsecaseProxy',
  ADD_BOOK_USECASE_PROXY = 'addBookUsecaseProxy',
  
  GET_CURRENT_USER_USECASE_PROXY = 'getCurrentUserUseCaseProxy',
  GET_ALL_BOOK_USECASE_PROXY = 'getAllBookUsecaseProxy',
  GET_BOOKS_BY_USER_USECASE_PROXY = 'getBookByUserUsecaseProxy',
  GET_BOOK_USECASE_PROXY = 'getBookUsecaseProxy',
  GET_BOOK_BY_NAME_USECASE_PROXY = 'getBookByNameUsecaseProxy',
  GET_BOOKINGS_BOOK_USECASE_PROXY = 'getBookingBookUsecaseProxy',

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
];

export function generateProviders() {
  return useCasesConfig.map((useCase) => ({
    provide: useCase.provide,
    inject: useCase.inject,
    useFactory: useCase.useFactory,
  }));
}
