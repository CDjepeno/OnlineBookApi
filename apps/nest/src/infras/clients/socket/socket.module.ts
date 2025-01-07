import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocketClient } from './socket.client';

@Module({
  imports: [ConfigModule],
  providers: [SocketClient],
  exports: [SocketClient],
})
export class SocketModules {}
