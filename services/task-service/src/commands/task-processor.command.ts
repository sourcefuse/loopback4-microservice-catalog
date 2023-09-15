import {ICommand} from '@sourceloop/core';
import {AnyObject} from '@loopback/repository';

export class TaskProcessorCommand implements ICommand {
  parameters: AnyObject;

  constructor(
    private readonly callbackFn: Function,
    private readonly processFn: Function,
    private readonly processParams: AnyObject[],
  ) {}

  async execute(): Promise<void> {
    const {task, taskService} = this.parameters;
    const {payload, vars} = this.callbackFn(task, taskService);

    await taskService.complete(task, vars);
    this.processParams.push(payload);
    await this.processFn(...this.processParams);
  }
}
