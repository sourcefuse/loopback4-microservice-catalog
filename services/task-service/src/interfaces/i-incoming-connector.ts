import {IEvent} from './i-event';

export interface IIncomingConnector {
  subscribe(handler: IEventStreamHandler): Promise<void>;
  unsubscribe(): Promise<void>;
}

export type IEventStreamHandler = (event: IEvent) => Promise<void>;
