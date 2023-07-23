// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model()
export class OtpCache extends CoreEntity<OtpCache> {
  @property({
    type: 'string',
  })
  otp?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'string',
  })
  otpSecret?: string;

  @property({
    type: 'string',
  })
  clientId: string;

  @property({
    type: 'string',
  })
  clientSecret: string;
}
