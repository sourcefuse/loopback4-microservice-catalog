import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model({
  name: 'webhook_subscriptions',
})
export class WebhookSubscriptions extends CoreEntity<WebhookSubscriptions> {
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
    description: 'An identifier for a particular event or task',
  })
  key: string;
}
