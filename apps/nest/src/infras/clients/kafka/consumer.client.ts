import { Logger, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { IConsumer } from 'src/repositories/consumer.repository';
import { sleep } from 'src/utils/utils';
import NodemailerClient from '../nodemailer/nodemailer.client';

export class ConsumerKafkajsClient implements IConsumer, OnModuleInit {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;
  private readonly topic: string;

  constructor(private emailService: NodemailerClient) {
    this.topic = 'notifications';
    this.kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER!] });
    this.consumer = this.kafka.consumer({ groupId: 'book-reservation-group' });
    this.logger = new Logger(`${this.topic}-book-reservation-group`);
    if (!this.emailService) {
      this.logger.error('NodemailerClient n\'est pas injecté correctement.');
    } else {
      this.logger.log('NodemailerClient est correctement injecté.');
    }
  }

  async consume() {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, message }) => {
          const messageValue = JSON.parse(message.value!.toString());
          this.logger.log(
            `Received message: ${messageValue.message} from topic: ${topic}`,
          );
        }
      });
    } catch (error: unknown) {
      throw new Error(`${error}`)
    }
    
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async connectAndSubscribe() {
    await this.connect();

    // S'abonner au topic avant de démarrer le consommateur
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
  }

  async onModuleInit() {
    await this.connectAndSubscribe();
    await this.consume();
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
