// Copyright (c) 2022 Sourcefuse Technologies
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

  constructor(data?: Partial<AuthRefreshTokenRequest>) {
    super(data);
  }
}
