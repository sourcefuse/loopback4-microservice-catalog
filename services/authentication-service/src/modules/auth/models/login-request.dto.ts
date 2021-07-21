/* eslint-disable @typescript-eslint/naming-convention */

import {Model, model, property} from '@loopback/repository';
import {ModelPropertyDescriptionString} from './model-property-description.enum';

@model({
  description: 'This is the signature for login request.',
})
export class LoginRequest extends Model {
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

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  password: string;

  constructor(data?: Partial<LoginRequest>) {
    super(data);
  }
}
