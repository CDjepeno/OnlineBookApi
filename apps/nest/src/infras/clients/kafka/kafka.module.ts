import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerKafkaClient } from './producer.client';
import { ConsumerKafkajsClient } from './consumer.client';
import NodemailerClient from '../nodemailer/nodemailer.client';
import { NodemailerModules } from '../nodemailer/nodemailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: configService.get<string>('KAFKA_BROKER')!.split(','), 
            },
            consumer: {
              groupId: configService.get<string>('KAFKA_CONSUMER_GROUP') || 'default-group',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    NodemailerModules,
  ],
  exports: [ProducerKafkaClient, ConsumerKafkajsClient], // Exporter pour réutilisation
  providers: [ProducerKafkaClient, ConsumerKafkajsClient, NodemailerClient],
  
})
export class ConfigKafkaModule {}