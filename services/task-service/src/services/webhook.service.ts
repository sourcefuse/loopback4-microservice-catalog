import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
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

  public async addToSubscription(url: string, event: string) {
    await this.webhookSubscriptionsRepo.create({
      event,
      url,
    });
  }

  public async triggerWebhook(event: string, data: any) {
    const subscribers = await this.webhookSubscriptionsRepo.find({
      where: {event},
    });
    if (subscribers.length > 0) {
      for (const subscriber of subscribers) {
        const url = subscriber.url;
        await this.httpService.post(url, data);
      }
    }
  }
}
