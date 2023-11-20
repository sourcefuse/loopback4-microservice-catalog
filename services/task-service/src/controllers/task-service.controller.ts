import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  Request,
  RestBindings,
  getModelSchemaRef,
  post,
  requestBody,
} from '@loopback/rest';
import {CONTENT_TYPE, OPERATION_SECURITY_SPEC} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {
  ApiKeyVerificationServiceInterface,
  TaskOperationServiceInterface,
  WebhookServiceInterface,
} from '../interfaces';
import {SubscriberDTO, TaskDto, TaskWorkflows} from '../models';
import {TaskWorkFlowMappingRepository} from '../repositories';
import {ApiKeyVerificationService} from '../services/api-key-verification.service';
import {TaskOperationService} from '../services/task-operation.service';
import {WebhookService} from '../services/webhook.service';

const baseUrl = 'tasks';

export class TaskServiceController {
  constructor(
    @service(TaskOperationService)
    private readonly taskOpsService: TaskOperationServiceInterface,
    @service(WebhookService)
    private readonly webhookService: WebhookServiceInterface,
    @service(ApiKeyVerificationService)
    private readonly apiKeyVerificationService: ApiKeyVerificationServiceInterface,
    @repository(TaskWorkFlowMappingRepository)
    private readonly taskWorkflowMapping: TaskWorkFlowMappingRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post(`${baseUrl}`, {security: OPERATION_SECURITY_SPEC, responses: {}})
  async updateTask(
    @requestBody()
    tasks: TaskDto,
  ) {
    await this.taskOpsService.taskUpdateFlow(tasks.taskKey, tasks.payload);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post(`${baseUrl}/subscribe`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
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
  @post(`${baseUrl}/mapping`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
  async mapTaskToWorkflow(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(TaskWorkflows, {
            title: 'TaskWorkFlowMapping',
          }),
        },
      },
    })
    taskWorkflowMapping: Omit<TaskWorkflows, 'id'>,
  ) {
    await this.taskWorkflowMapping.create(taskWorkflowMapping);
  }
}
