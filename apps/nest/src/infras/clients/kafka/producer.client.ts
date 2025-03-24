import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { Kafka, Message, Producer } from 'kafkajs';
import { IProducer } from 'src/repositories/producer.repository';

export class ProducerKafkaClient implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: Logger;
  private readonly producers = new Map<string, IProducer>();

  constructor(topic: string) {
    this.kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER!],
      ssl: {
        ca: [fs.readFileSync(process.env.KAFKA_CA_CERT_PATH!, 'utf-8')],
        cert: [fs.readFileSync(process.env.KAFKA_CLIENT_CERT_PATH!, 'utf-8')],
        key: [fs.readFileSync(process.env.KAFKA_CLIENT_KEY_PATH!, 'utf-8')],
      },
      sasl: process.env.KAFKA_SASL_MECHANISM
        ? {
            mechanism: process.env.KAFKA_SASL_MECHANISM as 'plain',
            username: process.env.KAFKA_USERNAME!,
            password: process.env.KAFKA_PASSWORD!,
          }
        : undefined,
    });
    this.producer = this.kafka.producer();
    this.logger = new Logger(topic);
  }

  async produce(message: Message, topic: string,) {
    await this.producer.connect();
    await this.producer.send({messages: [message], topic});
  }

  async connect() {
    try {
      await this.producer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await this.connect();
    }
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}




