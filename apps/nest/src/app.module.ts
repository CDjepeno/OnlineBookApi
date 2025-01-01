import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddBookUseCase } from './application/usecases/book/addBook/addBook.usecase';
import { BookingBookUseCase } from './application/usecases/booking/bookingBook/bookingBook.usecase';
import { AddUserUseCase } from './application/usecases/user/adduser/add.user.usecase';
import { ConfigTypeOrmModule } from './infras/clients/typeorm/typeorm.module';
import { ControllerModule } from './infras/controllers/controller.module';
import { RegisterController } from './infras/controllers/user/register/register.controller';
import { UsecaseProxyModule } from './infras/usecase-proxy/usecase-proxy.module';

@Module({
  imports: [
    UsecaseProxyModule.register(),
    ControllerModule,
    ConfigModule.forRoot(),
    ConfigTypeOrmModule,
  ],
  controllers: [RegisterController],
  providers: [AddUserUseCase, AddBookUseCase, BookingBookUseCase],
  exports: [AddUserUseCase, AddBookUseCase, BookingBookUseCase],
})
export class AppModule {}
