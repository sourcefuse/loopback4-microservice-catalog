import {service} from '@loopback/core';
import {ICommand} from '@sourceloop/core';
import {TaskOperationService} from '../services';

export class TaskProcessorCommand implements ICommand {
  parameters?: any;
  id: string;
  name: string;
  payload?: any;

  constructor(
    id: string,
    name: string,
    @service(TaskOperationService)
    private readonly taskOperationService: TaskOperationService,
    private readonly callbackFn: Function,
    payload?: any,
  ) {
    this.id = id;
    this.name = name;
    this.payload = payload;
  }

  async execute(): Promise<any> {
    const task = this.parameters.task;
    const taskService = this.parameters.taskService;

    const {vars} = this.callbackFn(task, taskService);

    console.log(this.payload);

    await taskService.complete(task, vars);
    await this.taskOperationService.processTask(
      this.id,
      this.name,
      this.payload,
    );
  }
}
