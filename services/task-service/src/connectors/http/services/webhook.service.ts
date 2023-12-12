import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import fetch from 'node-fetch';
import {IEvent} from '../../../interfaces';
import {WebhookSubscriptionsRepository} from '../repositories';

@injectable({scope: BindingScope.SINGLETON})
export class WebhookService {
  constructor(
    @repository(WebhookSubscriptionsRepository)
    private readonly webhookSubscriptionsRepo: WebhookSubscriptionsRepository,
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

  public async triggerWebhook(event: IEvent) {
    try {
      const subscribers = await this.webhookSubscriptionsRepo.find({
        where: {key: event.type},
      });

      if (subscribers.length > 0) {
        const postPromises = subscribers.map(subscriber =>
          fetch(subscriber.url, {
            method: 'post',
            body: JSON.stringify(event),
            headers: {
              'content-type': 'application/json',
            },
          }),
        );
        await Promise.all(postPromises);
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError('could not trigger webhook');
    }
  }
}
