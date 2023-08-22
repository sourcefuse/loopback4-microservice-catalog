import {service} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {TaskOperationService} from '../services/task-operation.service';
import {authorize} from 'loopback4-authorization';
import {WebhookService} from '../services';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {SubscriberDTO, TaskDto} from '../models';

const baseUrl = 'task-service';

export class TaskServiceController {
  constructor(
    @service(TaskOperationService)
    private readonly taskOpsService: TaskOperationService,
    @service(WebhookService)
    private readonly webhookService: WebhookService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post(`${baseUrl}/task`)
  async updateTask(
    @requestBody()
    Tasks: TaskDto,
  ) {
    try {
      await this.taskOpsService.taskUpdateFlow(Tasks.taskKey, Tasks.payload);
    } catch (e) {
      throw new HttpErrors.InternalServerError('Failed to update task');
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post(`${baseUrl}/subscribe`)
  async subscribeToWebhook(
    @requestBody()
    Subscriber: SubscriberDTO,
  ) {
    try {
      await this.webhookService.addToSubscription(
        Subscriber.url,
        Subscriber.key,
      );
    } catch (e) {
      throw new HttpErrors.InternalServerError('Failed to subscribe webhook');
    }
  }
}
