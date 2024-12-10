import { DynamicModule, Module } from '@nestjs/common';
import { AwsS3Module } from '../clients/aws/aws-s3.module';
import { generateProviders } from './usecase-proxy-config';
import { NodemailerModules } from '../clients/nodemailer/nodemailer.module';
import { RepositoriesModule } from '../services/repositories.module';
import { useCasesConfig } from './usecase-proxy-config';

@Module({
  imports: [RepositoriesModule, NodemailerModules, AwsS3Module],
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
