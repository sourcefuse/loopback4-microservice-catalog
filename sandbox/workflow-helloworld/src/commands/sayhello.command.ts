import {AnyObject} from '@loopback/repository';
import {ICommand} from '@sourceloop/bpmn-service';

export class SayHelloCommand implements ICommand {
  parameters: AnyObject;

  topic: string = 'hello-task'
  async execute() {
    const variables = this.parameters.task.variables.getAll() as AnyObject;
    const job = this.parameters.taskService;
    console.log(`Hello, ${variables.name}`);

    await job.complete(this.parameters.task);
  }

}
