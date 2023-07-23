// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model({
  description:
    'This is the signature for requesting the accessToken and refreshToken.',
})
export class AuthTokenRequest extends CoreModel<AuthTokenRequest> {
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
}
