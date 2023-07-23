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
export class OtpLoginRequest extends CoreModel<OtpLoginRequest> {
  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  key: string;

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  otp: string;
}
