import { AddBookUseCase } from 'src/application/usecases/book/addBook/addBook.usecase';
import { DeleteBookUsecase } from 'src/application/usecases/book/deleteBook/deleteBook.usecase';
import { DeleteBooksUsecase } from 'src/application/usecases/book/deleteBooks/deleteBooks.usecase';
import { GetAllBookUsecase } from 'src/application/usecases/book/getAllBook/getAllBook.usecase';
import { GetBookUsecase } from 'src/application/usecases/book/getBook/getBook.usecase';
import { GetBookByNameUsecase } from 'src/application/usecases/book/getBookByName/getBookByName.usecase';
import { GetBooksByUserUsecase } from 'src/application/usecases/book/getBooksByUser/getBooksByUser.usecase';
import { UpdateBookUseCase } from 'src/application/usecases/book/updateBook/updateBook.usecase';
import { BookingBookUseCase } from 'src/application/usecases/booking/bookingBook/bookingBook.usecase';
import { DeleteBookingsUserUsecase } from 'src/application/usecases/booking/deleteBookingsUser/deleteBookingsUser.usecase';
import { DeleteBookingUserUsecase } from 'src/application/usecases/booking/deleteBookingUser/deleteBookingUser.usecase';
import { GetBookingsDatesByBookUseCase } from 'src/application/usecases/booking/getBookingsBook/getBookingsDates.usecase';
import { GetBookingsUserUseCase } from 'src/application/usecases/booking/getBookingsUser/getBookingsUser.usecase';
import { UpdateBookingUserUseCase } from 'src/application/usecases/booking/updateBooking/updateBookingUser.usecase';
import { ContactUseCase } from 'src/application/usecases/contact/contact.usecase';
import { AddUserUseCase } from 'src/application/usecases/user/adduser/add.user.usecase';
import { GetCurrentUserUseCase } from 'src/application/usecases/user/auth/GetCurrentUser/get.current.user.usecase';
import { LoginUserUseCase } from 'src/application/usecases/user/auth/login/login.user.usecase';
import { LogoutUserUseCase } from 'src/application/usecases/user/auth/logout/logout.user.usecase';
import { RefreshTokenUseCase } from 'src/application/usecases/user/auth/refreshToken/refresh.token.usecase';
import { VerifyOtpUseCase } from 'src/application/usecases/user/auth/verifyOtp/VerifyOtp.usecase';
import { GetUserByIdUseCase } from 'src/application/usecases/user/GetUserById/get.user_by_id.usecase';
import { UpdateUserUseCase } from 'src/application/usecases/user/updateUser/update.user.usecase';
import { AwsS3Client } from 'src/infras/clients/aws/aws-s3.client';
import NodemailerClient from 'src/infras/clients/nodemailer/nodemailer.client';
// import { ConsumerKafkajsClient } from '../clients/kafka/consumer.client';
// import { ProducerKafkaClient } from '../clients/kafka/producer.client';
import { SocketClient } from '../clients/socket/socket.client';
import { BookRepositoryTypeorm } from '../services/book.repository.typeorm';
import { BookingRepositoryTypeorm } from '../services/booking.repository.typeorm';
import { ContactRepositoryTypeorm } from '../services/contact.repository.typeorm';
import { UserRepositoryTypeorm } from '../services/user.repository.typeorm';
import { UseCaseProxy } from './usecase-proxy';
import { RedisClient } from '../clients/redis/redis.client';
import { DeleteUserUsecase } from 'src/application/usecases/user/deleteUser/delete.user.usecase';
import { OAuthGoogleUseCase } from 'src/application/usecases/user/auth/OAuthGoogle/OAuthGoogle.usecase';

export enum UsecaseProxyEnum {
  CREATE_USER_USECASE_PROXY = 'createUserUsecaseProxy',
  LOGIN_USER_USECASE_PROXY = 'loginUserUseCaseProxy',
  VERIFY_OTP = 'VefifyOtp',
  LOGOUT_USER_USECASE_PROXY = 'logoutUserUseCaseProxy',
  REFRESH_TOKEN_USECASE_PROXY = 'refreshTokenUseCaseProxy',
  GET_CURRENT_USER_USECASE_PROXY = 'getCurrentUserUseCaseProxy',
  GET_USER_BY_ID_USECASE_PROXY = 'getUserByIdUseCaseProxy',
  UPDATE_USER_USECASE_PROXY = 'updateUserUseCaseProxy',
  DELETE_USER_USECASE_PROXY = 'deleteUserUseCaseProxy',
  OAUTH_GOOGLE_USECASE_PROXY = 'oauthgoogleUseCaseProxy',

  ADD_BOOK_USECASE_PROXY = 'addBookUsecaseProxy',
  GET_ALL_BOOK_USECASE_PROXY = 'getAllBookUsecaseProxy',
  GET_BOOKS_BY_USER_USECASE_PROXY = 'getBookByUserUsecaseProxy',
  GET_BOOK_USECASE_PROXY = 'getBookUsecaseProxy',
  GET_BOOK_BY_NAME_USECASE_PROXY = 'getBookByNameUsecaseProxy',
  DELETE_BOOK_USECASE_PROXY = 'deleteBookUsecaseProxy',
  DELETE_BOOKS_USECASE_PROXY = 'deleteBooksUsecaseProxy',
  UPDATE_BOOK_USECASE_PROXY = 'updateBookUsecaseProxy',

  BOOKING_BOOK_USECASE_PROXY = 'BookingBookUsecaseProxy',
  GET_BOOKINGS_DATES_BY_BOOK_USECASE_PROXY = 'getBookingDatesByBookUsecaseProxy',
  GET_BOOKINGS_USER_USECASE_PROXY = 'getBookingUserUsecaseProxy',
  UPDATE_BOOKING_USER_USECASE_PROXY = 'updateBookingUserUsecaseProxy',
  DELETE_BOOKING_USER_USECASE_PROXY = 'deleteBookingUserUsecaseProxy',
  DELETE_BOOKINGS_USER_USECASE_PROXY = 'deleteBookingsUserUsecaseProxy',

  CONTACT_USECASE_PROXY = 'contactUseCaseProxy',
}

export const useCasesConfig = [
  // ---------------------------- USER -----------------------------------
  {
    inject: [UserRepositoryTypeorm, NodemailerClient],
    provide: UsecaseProxyEnum.CREATE_USER_USECASE_PROXY,
    useFactory: (
      userRepository: UserRepositoryTypeorm,
      nodemailerClient: NodemailerClient,
    ) => new UseCaseProxy(new AddUserUseCase(userRepository, nodemailerClient)),
  },
  {
    inject: [UserRepositoryTypeorm],
    provide: UsecaseProxyEnum.UPDATE_USER_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTypeorm) =>
      new UseCaseProxy(new UpdateUserUseCase(userRepository)),
  },
  {
    inject: [UserRepositoryTypeorm],
    provide: UsecaseProxyEnum.REFRESH_TOKEN_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTypeorm) =>
      new UseCaseProxy(new RefreshTokenUseCase(userRepository)),
  },
  {
    inject: [UserRepositoryTypeorm],
    provide: UsecaseProxyEnum.LOGOUT_USER_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTypeorm) =>
      new UseCaseProxy(new LogoutUserUseCase(userRepository)),
  },
  {
    inject: [UserRepositoryTypeorm, NodemailerClient, RedisClient],
    provide: UsecaseProxyEnum.LOGIN_USER_USECASE_PROXY,
    useFactory: (
      userRepository: UserRepositoryTypeorm,
      nodeMailerClient: NodemailerClient,
      redisClient: RedisClient,
    ) =>
      new UseCaseProxy(
        new LoginUserUseCase(userRepository,redisClient, nodeMailerClient),
      ),
  },
  {
    inject: [UserRepositoryTypeorm],
    provide: UsecaseProxyEnum.GET_CURRENT_USER_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTypeorm) =>
      new UseCaseProxy(new GetCurrentUserUseCase(userRepository)),
  },
  {
    inject: [UserRepositoryTypeorm, RedisClient],
    provide: UsecaseProxyEnum.VERIFY_OTP,
    useFactory: (
      userRepository: UserRepositoryTypeorm,
      redisClient: RedisClient,
    ) => new UseCaseProxy(new VerifyOtpUseCase(userRepository, redisClient)),
  },
  {
    inject: [UserRepositoryTypeorm],
    provide: UsecaseProxyEnum.GET_USER_BY_ID_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTypeorm) =>
      new UseCaseProxy(new GetUserByIdUseCase(userRepository)),
  },
  {
    inject: [UserRepositoryTypeorm],
    provide: UsecaseProxyEnum.DELETE_USER_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTypeorm) =>
      new UseCaseProxy(new DeleteUserUsecase(userRepository)),
  },
  {
    inject: [UserRepositoryTypeorm],
    provide: UsecaseProxyEnum.DELETE_USER_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTypeorm) =>
      new UseCaseProxy(new DeleteUserUsecase(userRepository)),
  },
  {
    inject: [UserRepositoryTypeorm],
    provide: UsecaseProxyEnum.OAUTH_GOOGLE_USECASE_PROXY,
    useFactory: (userRepository: UserRepositoryTypeorm) =>
      new UseCaseProxy(new OAuthGoogleUseCase(userRepository)),
  },
  // ----------------------- BOOK -------------------------------
  {
    inject: [BookRepositoryTypeorm],
    provide: UsecaseProxyEnum.GET_BOOK_BY_NAME_USECASE_PROXY,
    useFactory: (bookRepository: BookRepositoryTypeorm) =>
      new UseCaseProxy(new GetBookByNameUsecase(bookRepository)),
  },
  {
    inject: [BookRepositoryTypeorm, AwsS3Client],
    provide: UsecaseProxyEnum.ADD_BOOK_USECASE_PROXY,
    useFactory: (
      bookRepository: BookRepositoryTypeorm,
      awsS3Client: AwsS3Client,
    ) => new UseCaseProxy(new AddBookUseCase(bookRepository, awsS3Client)),
  },
  {
    inject: [BookRepositoryTypeorm],
    provide: UsecaseProxyEnum.GET_ALL_BOOK_USECASE_PROXY,
    useFactory: (bookRepository: BookRepositoryTypeorm) =>
      new UseCaseProxy(new GetAllBookUsecase(bookRepository)),
  },
  {
    inject: [BookRepositoryTypeorm],
    provide: UsecaseProxyEnum.GET_BOOKS_BY_USER_USECASE_PROXY,
    useFactory: (bookRepository: BookRepositoryTypeorm) =>
      new UseCaseProxy(new GetBooksByUserUsecase(bookRepository)),
  },
  {
    inject: [BookRepositoryTypeorm],
    provide: UsecaseProxyEnum.GET_BOOK_USECASE_PROXY,
    useFactory: (bookRepository: BookRepositoryTypeorm) =>
      new UseCaseProxy(new GetBookUsecase(bookRepository)),
  },
  {
    inject: [BookRepositoryTypeorm],
    provide: UsecaseProxyEnum.DELETE_BOOK_USECASE_PROXY,
    useFactory: (bookRepository: BookRepositoryTypeorm) =>
      new UseCaseProxy(new DeleteBookUsecase(bookRepository)),
  },
  {
    inject: [BookRepositoryTypeorm, AwsS3Client],
    provide: UsecaseProxyEnum.UPDATE_BOOK_USECASE_PROXY,
    useFactory: (
      bookRepository: BookRepositoryTypeorm,
      awsS3Client: AwsS3Client,
    ) => new UseCaseProxy(new UpdateBookUseCase(bookRepository, awsS3Client)),
  },
  {
    inject: [BookRepositoryTypeorm],
    provide: UsecaseProxyEnum.DELETE_BOOKS_USECASE_PROXY,
    useFactory: (bookRepository: BookRepositoryTypeorm) =>
      new UseCaseProxy(new DeleteBooksUsecase(bookRepository)),
  },

  // -------------------------------- BOOKING -------------------------------------
  {
    inject: [
      BookingRepositoryTypeorm,
      // ProducerKafkaClient,
      // ConsumerKafkajsClient,
      NodemailerClient,
      SocketClient,
    ],
    provide: UsecaseProxyEnum.BOOKING_BOOK_USECASE_PROXY,
    useFactory: (
      bookingRepository: BookingRepositoryTypeorm,
      // producerKafkaClient: ProducerKafkaClient,
      // consumerKafkaClient: ConsumerKafkajsClient,
      nodeMailerClient: NodemailerClient,
      socketClient: SocketClient,
    ) =>
      new UseCaseProxy(
        new BookingBookUseCase(
          bookingRepository,
          // producerKafkaClient,
          // consumerKafkaClient,
          nodeMailerClient,
          socketClient,
        ),
      ),
  },
  {
    inject: [BookingRepositoryTypeorm],
    provide: UsecaseProxyEnum.GET_BOOKINGS_USER_USECASE_PROXY,
    useFactory: (bookingRepository: BookingRepositoryTypeorm) =>
      new UseCaseProxy(new GetBookingsUserUseCase(bookingRepository)),
  },
  {
    inject: [BookingRepositoryTypeorm],
    provide: UsecaseProxyEnum.GET_BOOKINGS_DATES_BY_BOOK_USECASE_PROXY,
    useFactory: (bookingRepository: BookingRepositoryTypeorm) =>
      new UseCaseProxy(new GetBookingsDatesByBookUseCase(bookingRepository)),
  },
  {
    inject: [BookingRepositoryTypeorm],
    provide: UsecaseProxyEnum.UPDATE_BOOKING_USER_USECASE_PROXY,
    useFactory: (updateBookingRepository: BookingRepositoryTypeorm) =>
      new UseCaseProxy(new UpdateBookingUserUseCase(updateBookingRepository)),
  },
  {
    inject: [BookingRepositoryTypeorm],
    provide: UsecaseProxyEnum.DELETE_BOOKING_USER_USECASE_PROXY,
    useFactory: (deleteBookingRepository: BookingRepositoryTypeorm) =>
      new UseCaseProxy(new DeleteBookingUserUsecase(deleteBookingRepository)),
  },
  {
    inject: [BookingRepositoryTypeorm],
    provide: UsecaseProxyEnum.DELETE_BOOKINGS_USER_USECASE_PROXY,
    useFactory: (deleteBookingsRepository: BookingRepositoryTypeorm) =>
      new UseCaseProxy(new DeleteBookingsUserUsecase(deleteBookingsRepository)),
  },
  // -------------------------------- CONTACT -------------------------------------
  {
    inject: [ContactRepositoryTypeorm, NodemailerClient],
    provide: UsecaseProxyEnum.CONTACT_USECASE_PROXY,
    useFactory: (
      contactRepository: ContactRepositoryTypeorm,
      nodemailer: NodemailerClient,
    ) => new UseCaseProxy(new ContactUseCase(contactRepository, nodemailer)),
  },
];

export function generateProviders() {
  return useCasesConfig.map((useCase) => ({
    provide: useCase.provide,
    inject: useCase.inject,
    useFactory: useCase.useFactory,
  }));
}
