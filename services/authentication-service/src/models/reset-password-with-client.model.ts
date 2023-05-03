// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */

import {Model, model, property} from '@loopback/repository';
import {IAuthClientDTO} from '..';

@model()
export class ResetPasswordWithClient extends Model implements IAuthClientDTO {
  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  // sonarignore:start
  @property({
    type: 'string',
    required: true,
  })
  client_id: string;

  @property({
    type: 'string',
    required: true,
  })
  client_secret: string;
  // sonarignore:end

  constructor(data?: Partial<ResetPasswordWithClient>) {
    super(data);
  }
}
