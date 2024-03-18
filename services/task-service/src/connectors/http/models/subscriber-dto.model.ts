import {Model, model, property} from '@loopback/repository';

@model()
export class SubscriberDTO extends Model {
  @property({
    type: 'string',
    required: true,
    description: 'url of the regsiterer who is subscribed to the webhook',
  })
  url: string;

  @property({
    type: 'string',
    required: true,
    description: 'identifier of an event key or task key',
  })
  key: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;
}
