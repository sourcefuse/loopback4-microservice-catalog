import {EachMessagePayload} from 'kafkajs';
import {IEvent, IEventAdapter} from '../../interfaces';
import {Source} from '../../types';

export class KafkaEventAdapter<T> implements IEventAdapter<
  EachMessagePayload,
  IEvent
> {
  adaptTo(event: EachMessagePayload): Promise<IEvent<T>> {
    const key = event.topic;
    const timestamp = Number(event.message.timestamp);
    const source = Source.Kafka;
    const payload = JSON.parse(event.message.value?.toString('utf8') ?? '{}');
    return Promise.resolve({key, timestamp, source, payload});
  }

  async adaptFrom(event: IEvent) {
    return event;
  }
}
