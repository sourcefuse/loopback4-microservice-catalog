import {Model, model, property} from '@loopback/repository';

@model()
export class ClientAppDTO extends Model {
  @property({
    type: 'string',
    required: true,
    description: 'An identifier for a client',
  })
  key: string;

  @property({
    type: 'string',
    description: 'An extra layer of auth',
  })
  secret: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;
}
