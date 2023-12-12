import {AnyObject} from '@loopback/repository';
import {ICommand} from '@sourceloop/core';
import {Variables} from 'camunda-external-task-client-js';

export class ReadDataCommand implements ICommand {
  topic = 'read-data';
  parameters: AnyObject;
  constructor() {}
  async execute(): Promise<void> {
    const job = this.parameters.taskService;
    const processVariables = new Variables();
    processVariables.set(
      'dummy-variable',
      JSON.stringify([
        {
          priority: 1,
        },
      ]),
    );

    await job.complete(this.parameters.task, processVariables);
  }
}
