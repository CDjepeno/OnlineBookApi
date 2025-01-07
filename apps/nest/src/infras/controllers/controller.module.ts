import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { JwtAuthGuard } from 'src/infras/common/guards/jwt-auth.guard';
import { AwsS3Client } from '../clients/aws/aws-s3.client';
import { UsecaseProxyModule } from '../usecase-proxy/usecase-proxy.module';
import * as path from 'path';
import * as glob from 'glob';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadControllers(): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controllers: any[] = [];
  const files = glob.sync(
    path.join(__dirname, './**/*.controller.{ts,js}'),
  );
  
  for (const file of files) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const module = require(file);
    for (const exported in module) {
      if (module[exported].prototype) {
        controllers.push(module[exported]);
      }
    }
  }
  return controllers;
}
loadControllers()
@Module({
  imports: [
    UsecaseProxyModule.register(),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: loadControllers(),
  providers: [JwtAuthGuard, JwtService, AwsS3Client],
})
export class ControllerModule {}
