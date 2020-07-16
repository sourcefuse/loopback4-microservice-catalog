import {model, property} from '@loopback/repository';

import {RefreshTokenRequest} from '../../../models';
import {ModelPropertyDescriptionString} from './model-property-description.enum';

@model({
  description: `This is a signature for reset password.`,
})
export class ResetPassword extends RefreshTokenRequest {
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

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
  })
  oldPassword?: string;

  constructor(data?: Partial<ResetPassword>) {
    super(data);
  }
}
