import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigTypeOrmModule } from './infras/clients/typeorm/typeorm.module';
import { ControllerModule } from './infras/controllers/controller.module';
import { RegisterController } from './infras/controllers/user/register/register.controller';
import { UsecaseProxyModule } from './infras/usecase-proxy/usecase-proxy.module';
// import { ConfigKafkaModule } from './infras/clients/kafka/kafka.module';
import { NodemailerModules } from './infras/clients/nodemailer/nodemailer.module';
import { RedisModules } from './infras/clients/redis/redis.module';
import { SocketModules } from './infras/clients/socket/socket.module';

@Module({
  imports: [
    UsecaseProxyModule.register(),
    ControllerModule,
    ConfigTypeOrmModule,
    RedisModules,
    NodemailerModules,
    // ConfigKafkaModule,
    SocketModules,
    ConfigModule.forRoot({
      isGlobal: true, // Rendre ConfigService accessible partout dans l'application
      envFilePath: '.env', // Assurez-vous d'utiliser le bon fichier .env si ce n'est pas le fichier par défaut
    }),
  ],
  controllers: [RegisterController],
  providers: [],
  exports: [],
})
export class AppModule {}
