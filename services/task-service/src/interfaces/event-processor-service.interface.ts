import {Event} from '../models';

export interface EventProcessorServiceInterface {
  processEvent(event: Event): Promise<void>;
}
