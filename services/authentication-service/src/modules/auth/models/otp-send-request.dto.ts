// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';
import {ModelPropertyDescriptionString} from './model-property-description.enum';

@model({
  description: 'This is the signature for OTP login request.',
})
export class OtpSendRequest extends CoreModel<OtpSendRequest> {
  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_id: string; //NOSONAR

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_secret: string; //NOSONAR

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  key: string;
}
