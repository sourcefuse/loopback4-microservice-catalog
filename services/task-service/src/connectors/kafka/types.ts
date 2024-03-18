import {
  ConsumerConfig,
  KafkaConfig as KafkaConnectionConfig,
  ProducerConfig,
} from 'kafkajs';

export type KafkaConfig<T> = {
  connection: KafkaConnectionConfig;
  consumer: ConsumerConfig;
  producer: ProducerConfig;
  topics: string[];
  output?: {
    topic: string;
    key?: string | ((event: T) => string);
  };
};

export type ProducerOptions = {
  topic: string;
  key: string;
};
