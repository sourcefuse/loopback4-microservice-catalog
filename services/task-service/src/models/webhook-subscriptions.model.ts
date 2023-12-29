import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'webhook_subscriptions',
})
export class WebhookSubscriptions extends UserModifiableEntity<WebhookSubscriptions> {
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
