import {Entity, model, property} from '@loopback/repository';

@model()
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
