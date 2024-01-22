import {IEvent} from './i-event';

export interface IEventProcessor {
  handle(event: IEvent): Promise<void>;
}
