import {ICommand} from '@sourceloop/core';
import {AnyObject} from '@loopback/repository';

/**
 * Class to process external tasks configured as service
 * tasks in bpmn engine such as camunda.
 */

export class TaskProcessorCommand implements ICommand {
  parameters: AnyObject;

  /**
   *
   * @param {Function} callbackFn plug in the logic given by the consumer
   * @param {Function} processFn process function to run after the logic is executed
   * @param {AnyObject[]} processParams an array of params required by the process function
   */

  constructor(
    private readonly callbackFn: Function,
    private readonly processFn: Function,
    private readonly processParams: AnyObject[],
  ) {}

  /**
   * @property {Function} execute the logic within the external tasks
   * which are currently configured as service tasks
   * @return {void}
   */
  async execute(): Promise<void> {
    const {task, taskService} = this.parameters;
    const {payload, vars} = this.callbackFn(task, taskService);

    await taskService.complete(task, vars);
    this.processParams.push(payload);
    await this.processFn(...this.processParams);
  }
}
