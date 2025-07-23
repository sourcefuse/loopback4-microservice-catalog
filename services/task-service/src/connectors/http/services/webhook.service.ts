import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {IEvent} from '../../../interfaces';
import {WebhookSubscriptionRepository} from '../repositories';
import {ApiKeyService} from './api-key.service';
import {HttpClientService} from '../../../services';

@injectable({scope: BindingScope.SINGLETON})
export class WebhookService {
  constructor(
    @repository(WebhookSubscriptionRepository)
    private readonly webhookSubscriptionRepo: WebhookSubscriptionRepository,
    @service(ApiKeyService)
    private readonly apiKeyService: ApiKeyService,
    @service(HttpClientService)
    private readonly httpClientService: HttpClientService,
  ) {}

  public async addToSubscription(url: string, key: string) {
    try {
      const webhookSubscriptions = await this.webhookSubscriptionRepo.find({
        where: {
          url,
          key,
        },
      });
      if (webhookSubscriptions.length === 0) {
        await this.webhookSubscriptionRepo.create({
          key,
          url,
        });
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        `Could not add to subscription ${error.message}`,
      );
    }
  }

  public async getUrlOfSubscritption(key: string) {
    const webhookSubscriptions = await this.webhookSubscriptionRepo.find({
      where: {
        key,
      },
    });
    if (webhookSubscriptions.length === 1) {
      return webhookSubscriptions[0].url;
    }
    return null;
  }

  public async triggerWebhook(event: IEvent) {
    try {
      const subscribers = await this.webhookSubscriptionRepo.find({
        where: {key: event.key},
      });

      if (subscribers.length > 0) {
        const timestamp = Date.now();
        const signature = await this.apiKeyService.generateSignature(
          event,
          timestamp,
        );
        const postPromises = subscribers.map(subscriber =>
          this.httpClientService.post(subscriber.url, event, {
            headers: {
              'content-type': 'application/json',
              'x-task-signature': signature,
              'x-task-timestamp': timestamp.toString(),
            },
          }),
        );
        await Promise.all(postPromises);
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        `could not trigger webhook ${error.message}`,
      );
    }
  }
}
