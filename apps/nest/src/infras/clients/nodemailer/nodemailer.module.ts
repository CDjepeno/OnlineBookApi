import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import NodemailerClient from './nodemailer.client';

@Module({
  imports: [ConfigModule],
  providers: [NodemailerClient],
  exports: [NodemailerClient],
})
export class NodemailerModules {}
