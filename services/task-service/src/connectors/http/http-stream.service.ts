import {service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {IEvent, IIncomingConnector, IOutgoingConnector} from '../../interfaces';
import {WebhookService} from './services';

export class HttpStreamService
  implements IOutgoingConnector<IEvent>, IIncomingConnector
{
  constructor(
    @service(WebhookService)
    private readonly webhookService: WebhookService,
  ) {}

  async subscribe(handler: (event: IEvent) => Promise<void>): Promise<void> {
    throw HttpErrors.InternalServerError('Not implemented');
  }

  async unsubscribe(): Promise<void> {
    throw HttpErrors.InternalServerError('Not implemented');
  }

  async publish(event: IEvent): Promise<void> {
    await this.webhookService.triggerWebhook(event);
  }
}
