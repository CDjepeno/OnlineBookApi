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

  // private async getProducer(topic: string) {
   
  //   let producer = this.producers.get(topic);
  //   if (!producer) {
  //     producer = new ProducerKafkaClient(
  //       topic,
  //     );
  //     await producer!.connect();
  //     this.producers.set(topic, producer!);
  //   }
  //   return producer;
  // }

  async disconnect() {
    await this.producer.disconnect();
  }
}




