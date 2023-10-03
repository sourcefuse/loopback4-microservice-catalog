import {BindingScope, injectable, service} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {MessageDTO} from '../models';
import {WebhookSubscriptionsRepository} from '../repositories';
import {HttpClientService} from './http.service';

@injectable({scope: BindingScope.TRANSIENT})
export class WebhookService {
  constructor(
    @repository(WebhookSubscriptionsRepository)
    private readonly webhookSubscriptionsRepo: WebhookSubscriptionsRepository,
    @service(HttpClientService)
    private readonly httpService: HttpClientService,
  ) {}

  public async addToSubscription(url: string, key: string) {
    try {
      const webhookSubscriptions = await this.webhookSubscriptionsRepo.find({
        where: {
          url,
          key,
        },
      });
      if (webhookSubscriptions.length === 0) {
        await this.webhookSubscriptionsRepo.create({
          key,
          url,
        });
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError('Could not add to subscription');
    }
  }

  public async getUrlOfSubscritption(key: string) {
    const webhookSubscriptions = await this.webhookSubscriptionsRepo.find({
      where: {
        key,
      },
    });
    if (webhookSubscriptions.length === 1) {
      return webhookSubscriptions[0].url;
    }
    return null;
  }

  public async triggerWebhook(key: string, data: DataObject<MessageDTO>) {
    try {
      const subscribers = await this.webhookSubscriptionsRepo.find({
        where: {key},
      });

      if (subscribers.length > 0) {
        const postPromises = subscribers.map(subscriber =>
          this.httpService.post(subscriber.url, data),
        );
        await Promise.all(postPromises);
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError('could not trigger webhook');
    }
  }
}
