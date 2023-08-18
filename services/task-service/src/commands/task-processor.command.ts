import {service} from '@loopback/core';
import {ICommand} from '@sourceloop/core';
import {TaskOperationService} from '../services';
import {Variables} from 'camunda-external-task-client-js';

export class TaskProcessorCommand implements ICommand {
  parameters?: any;
  id: string;
  name: string;

  constructor(
    id: string,
    name: string,
    @service(TaskOperationService)
    private readonly taskOperationService: TaskOperationService,
    private readonly callbackFn: Function,
  ) {
    this.id = id;
    this.name = name;
  }

  async execute(): Promise<any> {
    const task = this.parameters.task;
    const taskService = this.parameters.taskService;

    const {payload, vars} = this.callbackFn(task, taskService);

    await taskService.complete(task, vars);
    await this.taskOperationService.processTask(this.id, this.name, payload);
  }
}
