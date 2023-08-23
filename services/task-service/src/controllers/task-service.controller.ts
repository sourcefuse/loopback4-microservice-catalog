import {inject, service} from '@loopback/core';
import {
  HttpErrors,
  Request,
  RestBindings,
  post,
  requestBody,
} from '@loopback/rest';
import {TaskOperationService} from '../services/task-operation.service';
import {authorize} from 'loopback4-authorization';
import {WebhookService} from '../services/webhook.service';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {SubscriberDTO, TaskDto} from '../models';
import {ApiKeyVerificationService} from '../services/api-key-verification.service';

const baseUrl = 'task-service';

export class TaskServiceController {
  constructor(
    @service(TaskOperationService)
    private readonly taskOpsService: TaskOperationService,
    @service(WebhookService)
    private readonly webhookService: WebhookService,
    @service(ApiKeyVerificationService)
    private readonly apiKeyVerificationService: ApiKeyVerificationService,
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
    @inject(RestBindings.Http.REQUEST) request: Request,
  ) {
    const apiKey = request.headers['x-api-key'];
    const apiSecret = request.headers['x-api-secret'];
    let isValidKeys = false;
    if (apiKey && apiSecret) {
      isValidKeys = await this.apiKeyVerificationService.verifyApiKeys(
        apiKey as string,
        apiSecret as string,
      );
    }

    if (!isValidKeys) {
      throw new HttpErrors.Unauthorized('Invalid API key or secret');
    }

    await this.webhookService.addToSubscription(Subscriber.url, Subscriber.key);
  }
}
