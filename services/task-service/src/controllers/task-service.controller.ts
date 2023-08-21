import {service} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {TaskOperationService} from '../services/task-operation.service';
import {authorize} from 'loopback4-authorization';

const baseUrl = 'task-service';

export class TaskServiceController {
  constructor(
    @service(TaskOperationService)
    private readonly taskOpsService: TaskOperationService,
  ) {}

  @authorize({permissions: ['*']})
  @post(`${baseUrl}/task`)
  async updateTask(
    @requestBody()
    Tasks: AnyObject,
  ) {
    try {
      await this.taskOpsService.taskUpdateFlow(Tasks.taskKey, Tasks.payload);
    } catch (e) {
      console.log(e);
      throw new HttpErrors.InternalServerError('Failed to update task');
    }
  }
}
