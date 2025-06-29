import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddBookUseCase } from './application/usecases/book/addBook/addBook.usecase';
import { AddUserUseCase } from './application/usecases/user/adduser/add.user.usecase';
import { TypeOModule } from './infras/clients/typeorm/type-orm.module';
import { ControllerModule } from './infras/controllers/controller.module';
import { AddUserController } from './infras/controllers/user/addUserController/addUser.controller';
import { UsecaseProxyModule } from './infras/usecase-proxy/usecase-proxy.module';

@Module({
  imports: [
    UsecaseProxyModule.register(),
    ControllerModule,
    ConfigModule.forRoot(),
    TypeOModule,
  ],
  controllers: [AddUserController],
  providers: [AddUserUseCase, AddBookUseCase],
  exports: [AddUserUseCase, AddBookUseCase],
})
export class AppModule {}
