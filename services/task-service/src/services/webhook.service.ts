import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {WebhookSubscriptionsRepository} from '../repositories';
import {HttpClientService} from './http.service';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class WebhookService {
  constructor(
    @repository(WebhookSubscriptionsRepository)
    private readonly webhookSubscriptionsRepo: WebhookSubscriptionsRepository,
    @service(HttpClientService)
    private readonly httpService: HttpClientService,
  ) {}

  public async addToSubscription(url: string, event: string) {
    try {
      const webhookSubscriptions = await this.webhookSubscriptionsRepo.find({
        where: {
          url,
          event,
        },
      });
      if (webhookSubscriptions.length == 0) {
        await this.webhookSubscriptionsRepo.create({
          event,
          url,
        });
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError('Could not add to subscription');
    }
  }

  public async getUrlOfSubscritption(event: string) {
    const webhookSubscriptions = await this.webhookSubscriptionsRepo.find({
      where: {
        event,
      },
    });
    if (webhookSubscriptions.length == 1) {
      return webhookSubscriptions[0].url;
    }
    return null;
  }

  public async triggerWebhook(event: string, data: any) {
    try {
      const subscribers = await this.webhookSubscriptionsRepo.find({
        where: {event},
      });
      if (subscribers.length > 0) {
        for (const subscriber of subscribers) {
          const url = subscriber.url;
          await this.httpService.post(url, data);
        }
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError('could not trigger webhook');
    }
  }
}
