import {inject, service} from '@loopback/core';
import {
  HttpErrors,
  Request,
  RestBindings,
  getModelSchemaRef,
  post,
  requestBody,
} from '@loopback/rest';
import {TaskOperationService} from '../services/task-operation.service';
import {authorize} from 'loopback4-authorization';
import {WebhookService} from '../services/webhook.service';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {SubscriberDTO, TaskDto, TaskWorkFlowMapping} from '../models';
import {ApiKeyVerificationService} from '../services/api-key-verification.service';
import {repository} from '@loopback/repository';
import {TaskWorkFlowMappingRepository} from '../repositories';
import {CONTENT_TYPE} from '@sourceloop/core';

const baseUrl = 'tasks';

export class TaskServiceController {
  constructor(
    @service(TaskOperationService)
    private readonly taskOpsService: TaskOperationService,
    @service(WebhookService)
    private readonly webhookService: WebhookService,
    @service(ApiKeyVerificationService)
    private readonly apiKeyVerificationService: ApiKeyVerificationService,
    @repository(TaskWorkFlowMappingRepository)
    private readonly taskWorkflowMapping: TaskWorkFlowMappingRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post(`${baseUrl}`)
  async updateTask(
    @requestBody()
    tasks: TaskDto,
  ) {
    try {
      await this.taskOpsService.taskUpdateFlow(tasks.taskKey, tasks.payload);
    } catch (e) {
      throw new HttpErrors.InternalServerError('Failed to update task');
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post(`${baseUrl}/subscribe`)
  async subscribeToWebhook(
    @requestBody()
    subscriber: SubscriberDTO,
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

    await this.webhookService.addToSubscription(subscriber.url, subscriber.key);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post(`${baseUrl}/mapping`)
  async mapTaskToWorkflow(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(TaskWorkFlowMapping, {
            title: 'TaskWorkFlowMapping',
          }),
        },
      },
    })
    taskWorkflowMapping: Omit<TaskWorkFlowMapping, 'id'>,
  ) {
    await this.taskWorkflowMapping.create(taskWorkflowMapping);
  }
}
