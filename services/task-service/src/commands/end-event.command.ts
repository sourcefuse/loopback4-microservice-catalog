import {ICommand} from '@sourceloop/core';

export class EndEventCommand implements ICommand {
  parameters?: any;

  async execute(): Promise<any> {
    const task = this.parameters.task;
    const taskService = this.parameters.taskService;

    console.log('event ended');
    console.log(task);

    // add all the tasks to the db

    await taskService.complete(task);
  }
}
