// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';

import {RefreshTokenRequest} from '../../../models';
import {ModelPropertyDescriptionString} from './model-property-description.enum';

@model({
  description: `This is a signature for reset password.`,
})
export class ResetPassword extends RefreshTokenRequest<ResetPassword> {
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
}
