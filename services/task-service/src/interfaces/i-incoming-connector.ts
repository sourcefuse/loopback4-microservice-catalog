import {IEvent} from './i-event';

export interface IIncomingConnector<T = IEvent> {
  subscribe(handler: IEventStreamHandler<T>): Promise<void>;
  unsubscribe(): Promise<void>;
}

export type IEventStreamHandler<T = IEvent> = (event: T) => Promise<void>;
