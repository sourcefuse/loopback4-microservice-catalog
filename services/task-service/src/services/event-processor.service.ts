import {injectable, BindingScope} from '@loopback/core';
import {Event} from '../types';
import {BPMNTask} from '../commands';

@injectable({
  scope: BindingScope.SINGLETON,
})
export class EventProcessorService {
  constructor() {
    // empty constuctor
  }
  processEvent(event: Event): void {
    console.log('Event: ', event);
    // Verify the event's body for proper task command
    // Perform actions based on the verified command

    // get the command using optional chaining
    const bpmnTaskCommand = event.payload?.BPMNTask?.command;

    if (bpmnTaskCommand) {
      const bpmnTaskToRun = new BPMNTask(bpmnTaskCommand);
      const data = event.payload?.BPMNTask?.commandParams;
      if (data) {
        bpmnTaskToRun.runTask(data, () => {
          console.log('event processed!');
        });
      }
    }
  }
}
