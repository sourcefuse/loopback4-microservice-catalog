// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, model, property} from '@loopback/repository';

@model()
export class OtpCache extends Entity {
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

  constructor(data?: Partial<OtpCache>) {
    super(data);
  }
}
