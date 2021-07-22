/* eslint-disable @typescript-eslint/naming-convention */

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
  client_id: string;

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  client_secret: string;

  constructor(data?: Partial<ClientAuthRequest>) {
    super(data);
  }
}
