import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisClient {
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      // host: this.configService.get<string>('REDIS_HOST') || 'redis',
      // port: this.configService.get<number>('REDIS_PORT') || 6379,
      // password: this.configService.get<string>('REDIS_PASSWORD') || 'mystrongpassword',
    });
  }

  async saveOtp(email: string, otp: string) {
    await this.redis.set(email, otp, 'EX', 300); // Expiration de 5 minutes
  }

  async getOtp(email: string): Promise<string | null> {
    return await this.redis.get(email);
  }

  async deleteOtp(email: string) {
    await this.redis.del(email);
  }
}