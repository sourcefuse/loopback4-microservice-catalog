// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Model, model, property} from '@loopback/repository';

@model()
export class RefreshTokenRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  refreshToken: string;

  constructor(data?: Partial<RefreshTokenRequest>) {
    super(data);
  }
}
