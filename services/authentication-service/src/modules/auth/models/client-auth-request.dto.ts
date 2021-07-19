import {Model, model, property} from '@loopback/repository';
import {ModelPropertyDescriptionString} from './model-property-description.enum';

@model({
  description: 'This is signature for client authentication request.',
})
export class ClientAuthRequest extends Model {
  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  clientId: string;

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  clientSecret: string;

  constructor(data?: Partial<ClientAuthRequest>) {
    super(data);
  }
}
