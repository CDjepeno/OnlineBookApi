import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsS3Client } from "./aws-s3.client"

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [AwsS3Client],
  exports: [AwsS3Client],
})
export class AwsS3Module {}
