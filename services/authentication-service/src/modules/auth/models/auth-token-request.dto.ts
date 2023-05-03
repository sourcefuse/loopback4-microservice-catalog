// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Model, model, property} from '@loopback/repository';

@model({
  description:
    'This is the signature for requesting the accessToken and refreshToken.',
})
export class AuthTokenRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  clientId: string;

  constructor(data?: Partial<AuthTokenRequest>) {
    super(data);
  }
}
