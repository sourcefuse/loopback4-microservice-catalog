import {ICommand} from '@sourceloop/core';

export class SendNotificationCommand implements ICommand {
  parameters?: any;
  topic: string;

  constructor(topic: string) {
    this.topic = topic;
  }

  async execute(): Promise<any> {
    const task = this.parameters.task;
    const taskService = this.parameters.taskService;

    console.log('simulate notifications - SENDING: ', this.topic);

    // send notification
    // ideally should lock the task
    // until the task is completed

    // complete
    console.log('simulate notifications - DONE');

    await taskService.complete(task);
  }
}
