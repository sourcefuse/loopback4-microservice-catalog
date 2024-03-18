import {inject} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {CompressionTypes, Consumer, EachMessagePayload, Kafka} from 'kafkajs';
import {
  IEventAdapter,
  IEventStreamHandler,
  IIncomingConnector,
  IOutgoingConnector,
} from '../../interfaces';
import {TaskServiceKafkaModule} from './keys';
import {KafkaConfig} from './types';

export class KafkaStreamService<T>
  implements IIncomingConnector<T>, IOutgoingConnector<T>
{
  constructor(
    @inject(TaskServiceKafkaModule.CONFIG)
    private readonly settings: KafkaConfig<T>,
    @inject(TaskServiceKafkaModule.ADAPTER)
    private readonly adapter: IEventAdapter<EachMessagePayload, T>,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
    @inject(TaskServiceKafkaModule.KAFKA_CLIENT, {optional: true})
    private readonly kafkaContructor: typeof Kafka,
  ) {
    if (!this.kafkaContructor) {
      this.kafkaContructor = Kafka;
    }
  }
  client: Kafka;
  consumer?: Consumer;
  async subscribe(handler: IEventStreamHandler<T>): Promise<void> {
    this.client = new this.kafkaContructor(this.settings.connection);
    this.consumer = this.client.consumer(this.settings.consumer);
    await this.consumer.connect();
    await this.consumer.subscribe({
      topics: this.settings.topics,
    });
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.adapter
          .adaptTo(payload)
          .then(message =>
            handler(message).catch(err => this.logger.error(err)),
          );
      },
    });
    this.consumer.on('consumer.connect', event => {
      this.logger.debug(`${event.payload}`);
    });
    this.consumer.on('consumer.crash', event => {
      this.logger.debug(`${event.payload}`);
    });
    this.consumer.on('consumer.disconnect', event => {
      this.logger.debug(`${event.payload}`);
    });
  }
  async unsubscribe(): Promise<void> {
    await this.consumer?.disconnect();
  }
  async publish(event: T): Promise<void> {
    const config = this.settings.output;
    if (!config) {
      this.logger.error('No output config found for kafka connector');
      return;
    }
    if (!this.client) {
      this.client = new this.kafkaContructor(this.settings.connection);
    }
    const producer = this.client.producer(this.settings.producer);
    await producer.connect();
    const adapted = await this.adapter.adaptFrom(event);
    await producer.send({
      topic: config.topic,
      compression: CompressionTypes.GZIP,
      messages: [
        {
          key: this.buildKey(config.key, adapted),
          value: JSON.stringify(adapted),
        },
      ],
    });
    await producer.disconnect();
  }

  private buildKey(
    key: string | ((event: T) => string) | undefined,
    event: T,
  ): string {
    if (!key) {
      return '';
    }
    if (typeof key === 'string') {
      return key;
    }
    return key(event);
  }
}
