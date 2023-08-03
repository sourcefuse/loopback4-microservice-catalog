import {injectable, BindingScope} from '@loopback/core';
import {Event} from '../types';
// import {BPMNTask} from '../commands';

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

    // each event in queue should start a master workflow

    // grab the workflow id from the event
    const toProcessWorkflow = event.payload.workflowId;

    // take the command
    const workflowCommand = event.payload.command;

    // get any command parameters
    // for eg. - if there any variables
    const workflowCommandParams = event.payload.commandParams;

    // verify the command
    if (workflowCommand) {
    }

    // get the command using optional chaining
    // const bpmnTaskCommand = event.payload?.BPMNTask?.command;

    // if (bpmnTaskCommand) {
    //   const bpmnTaskToRun = new BPMNTask(bpmnTaskCommand);
    //   const data = event.payload?.BPMNTask?.commandParams;
    //   if (data) {
    //     bpmnTaskToRun.runTask(data, () => {
    //       console.log('event processed!');
    //     });
    //   }
    // }
  }
}
