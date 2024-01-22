import {BindingKey} from '@loopback/core';
import {SQS} from 'aws-sdk';
import {IEventAdapter} from '../../interfaces/i-event-adapter';
import {SQSConfig} from './types';

export namespace TaskServiceSQSModule {
  export const CONFIG = BindingKey.create<SQSConfig>('sf.task.sqs.config');
  export const ADAPTER = BindingKey.create<IEventAdapter<SQS.Message, unknown>>(
    'sf.task.sqs.adapter',
  );
}
