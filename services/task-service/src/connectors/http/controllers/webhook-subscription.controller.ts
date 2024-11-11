import {inject, service} from '@loopback/core';
import {
  HttpErrors,
  Request,
  RestBindings,
  post,
  requestBody,
} from '@loopback/rest';
import {OPERATION_SECURITY_SPEC} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TaskPermssionKey} from '../../../enums/permission-key.enum';
import {SubscriberDTO} from '../../../models';
import {ApiKeyService, WebhookService} from '../services';

const baseUrl = '/webhooks';

export class WebhookSubscriptionController {
  constructor(
    @service(ApiKeyService)
    private readonly apiKeyService: ApiKeyService,
    @service(WebhookService)
    private readonly webhookService: WebhookService,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [TaskPermssionKey.SubscribeToWebhook]})
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
      isValidKeys = await this.apiKeyService.verify(
        apiKey as string,
        apiSecret as string,
      );
    }

    if (!isValidKeys) {
      throw new HttpErrors.Unauthorized('Invalid API key or secret');
    }

    await this.webhookService.addToSubscription(subscriber.url, subscriber.key);
  }
}
