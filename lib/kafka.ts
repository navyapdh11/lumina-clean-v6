import { Kafka, Producer } from 'kafkajs';

class KafkaClient {
  private static instance: KafkaClient;
  private producer: Producer | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): KafkaClient {
    if (!KafkaClient.instance) {
      KafkaClient.instance = new KafkaClient();
    }
    return KafkaClient.instance;
  }

  private async init() {
    if (this.initialized) return;

    if (!process.env.KAFKA_BROKERS) {
      console.warn('KAFKA_BROKERS not set — dispatch messages will be logged only');
      this.initialized = true;
      return;
    }

    const kafka = new Kafka({
      clientId: 'lumina-clean',
      brokers: process.env.KAFKA_BROKERS.split(','),
      ssl: process.env.KAFKA_SSL === 'true',
    });

    this.producer = kafka.producer();
    await this.producer.connect();
    this.initialized = true;
  }

  async produce(topic: string, message: Record<string, any>) {
    if (!this.initialized) await this.init();

    if (!this.producer) {
      console.log(`[KAFKA MOCK] ${topic}: ${JSON.stringify(message)}`);
      return;
    }

    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}

export const kafka = KafkaClient.getInstance();
