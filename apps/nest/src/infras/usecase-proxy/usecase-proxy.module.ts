import { DynamicModule, Module } from '@nestjs/common';
import { AwsS3Module } from '../clients/aws/aws-s3.module';
import { generateProviders } from './usecase-proxy-config';
import { NodemailerModules } from '../clients/nodemailer/nodemailer.module';
import { RepositoriesModule } from '../services/repositories.module';
import { useCasesConfig } from './usecase-proxy-config';
import { SocketModules } from '../clients/socket/socket.module';
import { ConfigKafkaModule } from '../clients/kafka/kafka.module';
import { RedisModules } from '../clients/redis/redis.module';

@Module({
  imports: [RepositoriesModule, NodemailerModules, AwsS3Module, SocketModules, RedisModules, ConfigKafkaModule],
})
export class UsecaseProxyModule {

  static register(): DynamicModule {
    return {
      module: UsecaseProxyModule,
      providers: generateProviders(),

      exports: useCasesConfig.map((useCase) => useCase.provide),
    };
  }
}
