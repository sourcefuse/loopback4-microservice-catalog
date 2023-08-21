import {service} from '@loopback/core';
import {ICommand} from '@sourceloop/core';
import {TaskOperationService} from '../services';
import {AnyObject} from '@loopback/repository';

export class TaskProcessorCommand implements ICommand {
  parameters: AnyObject;
  id: string;
  name: string;
  eventKey: string;

  constructor(
    id: string,
    name: string,
    @service(TaskOperationService)
    private readonly taskOperationService: TaskOperationService,
    private readonly callbackFn: Function,
    eventKey: string,
  ) {
    this.id = id;
    this.name = name;
    this.eventKey = eventKey;
  }

  async execute(): Promise<void> {
    const {task, taskService} = this.parameters;
    const {payload, vars} = this.callbackFn(task, taskService);

    await taskService.complete(task, vars);
    await this.taskOperationService.processTask(
      this.id,
      this.name,
      this.eventKey,
      payload,
    );
  }
}
