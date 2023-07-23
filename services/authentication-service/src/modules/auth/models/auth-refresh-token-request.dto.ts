// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class AuthRefreshTokenRequest extends CoreModel<AuthRefreshTokenRequest> {
  @property({
    type: 'string',
    required: true,
  })
  refreshToken: string;

  @property({
    type: 'string',
  })
  tenantId?: string;
}
