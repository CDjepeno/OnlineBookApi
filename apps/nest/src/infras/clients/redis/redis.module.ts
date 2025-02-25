import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisClient } from './redis.client';

@Module({
  imports: [ConfigModule],
  providers: [RedisClient],
  exports: [RedisClient],
})
export class RedisModules {}
