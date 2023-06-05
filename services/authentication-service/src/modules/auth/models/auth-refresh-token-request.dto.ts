// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Model, model, property} from '@loopback/repository';

@model()
export class AuthRefreshTokenRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  refreshToken: string;

  @property({
    type: 'string',
  })
  tenantId?: string;

  constructor(data?: Partial<AuthRefreshTokenRequest>) {
    super(data);
  }
}
