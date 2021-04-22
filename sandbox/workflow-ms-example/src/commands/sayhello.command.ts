import {AnyObject} from '@loopback/repository';
import {ICommand} from '@sourceloop/bpmn-service';
import {Variables} from '../types';

export class SayHelloCommand implements ICommand {
  parameters: AnyObject;

  topic = 'hello-task';
  async execute() {
    const variables = this.parameters.task.variables.getAll() as Variables;
    const job = this.parameters.taskService;
    console.log(`Hello, ${variables.name}`); //NOSONAR

    await job.complete(this.parameters.task);
  }
}
