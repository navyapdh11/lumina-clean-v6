import { Kafka, Producer } from 'kafkajs';

class KafkaClient {
  private static instance: KafkaClient;
  private producer: Producer | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): KafkaClient {
    if (!KafkaClient.instance) {
      KafkaClient.instance = new KafkaClient();
    }
    return KafkaClient.instance;
  }

  private async init(): Promise<void> {
    if (this.initialized || this.initPromise) {
      if (this.initPromise) await this.initPromise;
      return;
    }

    if (!process.env.KAFKA_BROKERS) {
      console.warn('[Kafka] KAFKA_BROKERS not set — dispatch messages will be logged only');
      this.initialized = true;
      return;
    }

    // Prevent concurrent init calls
    this.initPromise = (async () => {
      try {
        const kafka = new Kafka({
          clientId: 'perth-clean',
          brokers: process.env.KAFKA_BROKERS!.split(','),
          ssl: process.env.KAFKA_SSL === 'true',
        });

        this.producer = kafka.producer();
        await this.producer.connect();
        this.initialized = true;
        console.log('[Kafka] Producer connected successfully');
      } catch (error) {
        console.error('[Kafka] Failed to connect producer:', error);
        this.producer = null;
        this.initialized = false;
        // Allow retry on next produce call
      } finally {
        this.initPromise = null;
      }
    })();

    await this.initPromise;
  }

  async produce(topic: string, message: Record<string, unknown>) {
    if (!this.initialized) {
      try {
        await this.init();
      } catch {
        // Log and continue — Kafka failure should not break the app
      }
    }

    if (!this.producer) {
      console.log(`[Kafka Log] ${topic}: ${JSON.stringify(message)}`);
      return;
    }

    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
    } catch (error) {
      console.error(`[Kafka] Failed to send message to ${topic}:`, error);
      // Reset initialized to allow reconnection on next call
      this.initialized = false;
    }
  }
}

export const kafka = KafkaClient.getInstance();
