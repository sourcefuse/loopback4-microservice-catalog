import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'webhook_subscriptions',
})
export class WebhookSubscriptions extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'string',
    required: true,
  })
  event: string;
}
