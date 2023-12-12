import {BindingKey} from '@loopback/core';
import {EachMessagePayload} from 'kafkajs';
import {IEventAdapter} from '../../interfaces/i-event-adapter';
import {KafkaConfig} from './types';

export namespace TaskServiceKafkaModule {
  export const CONFIG = BindingKey.create<KafkaConfig<unknown>>(
    'sf.task.kafka.config',
  );
  export const ADAPTER = BindingKey.create<
    IEventAdapter<EachMessagePayload, unknown>
  >('sf.task.kafka.adapter');
}
