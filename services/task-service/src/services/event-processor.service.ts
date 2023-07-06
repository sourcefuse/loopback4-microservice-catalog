import {injectable, BindingScope} from '@loopback/core';
import {Event} from '../types';

@injectable({
  scope: BindingScope.SINGLETON,
})
export class EventProcessorService {
  constructor() {}
  processEvent(event: Event): void {
    console.log('Event: ', event);
    // Verify the event's body for proper task command
    // Perform actions based on the verified command
  }
}
