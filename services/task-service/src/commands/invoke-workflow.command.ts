import {AnyObject} from '@loopback/repository';
import {ICommand} from '@sourceloop/bpmn-service';
import {CamundaService} from '../services';

export class InvokeWorkflowCommand implements ICommand {
  parameters: AnyObject;
  topic: string;
  camunda: CamundaService;
  id: string;

  constructor(id: string, topic: string, camunda: CamundaService) {
    this.topic = topic;
    this.camunda = camunda;
    this.id = id;
  }

  async execute(): Promise<void> {
    const task = this.parameters.task;
    const taskService = this.parameters.taskService;

    console.log('STARTING WORKFLOW - ', this.topic);

    // start the new workflow
    await this.camunda.execute(this.id, {});

    // send notification

    // complete
    console.log('EXTERNAL TASK COMPLETED');

    await taskService.complete(task);
  }
}
