import {Event} from '../models';
import {HealthResponse} from '../types';

export interface EventQueueServiceInterface {
  enqueueEvent(event: Partial<Event>): Promise<void>;
  healthCheck(): Promise<HealthResponse>;
}
