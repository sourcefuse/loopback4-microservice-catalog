import {BindingScope, inject, injectable, service} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {IEvent, IIncomingConnector, IOutgoingConnector} from '../../interfaces';
import {WebhookService} from './services';

@injectable({scope: BindingScope.SINGLETON})
export class HttpStreamService
  implements IOutgoingConnector<IEvent>, IIncomingConnector
{
  constructor(
    @service(WebhookService)
    private readonly webhookService: WebhookService,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
  ) {}
  private _handler?: (event: IEvent) => Promise<void>;

  async triggerHandler(event: IEvent): Promise<void> {
    if (this._handler) {
      await this._handler(event);
    } else {
      this.logger.error('No handler registered for HttpStreamService');
    }
  }

  async subscribe(handler: (event: IEvent) => Promise<void>): Promise<void> {
    this._handler = handler;
  }

  async unsubscribe(): Promise<void> {
    this._handler = undefined;
  }

  async publish(event: IEvent): Promise<void> {
    await this.webhookService.triggerWebhook(event);
  }
}
