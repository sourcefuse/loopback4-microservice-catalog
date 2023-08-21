import {service} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {TaskOperationService} from '../services/task-operation.service';
import {authorize} from 'loopback4-authorization';
import {WebhookService} from '../services';

const baseUrl = 'task-service';

export class TaskServiceController {
  constructor(
    @service(TaskOperationService)
    private readonly taskOpsService: TaskOperationService,
    @service(WebhookService)
    private readonly webhookService: WebhookService,
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
      throw new HttpErrors.InternalServerError('Failed to update task');
    }
  }

  @authorize({permissions: ['*']})
  @post(`${baseUrl}/subscribe`)
  async subscribeToWebhook(
    @requestBody()
    Registerer: AnyObject,
  ) {
    try {
      await this.webhookService.addToSubscription(
        Registerer.url,
        Registerer.event,
      );
    } catch (e) {
      throw new HttpErrors.InternalServerError('Failed to subscribe webhook');
    }
  }
}
