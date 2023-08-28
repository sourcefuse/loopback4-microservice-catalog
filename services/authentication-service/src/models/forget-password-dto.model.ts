// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';
import {IAuthClientDTO} from '..';

@model()
export class ForgetPasswordDto
  extends CoreModel<ForgetPasswordDto>
  implements IAuthClientDTO
{
  @property({
    type: 'string',
    required: true,
  })
  username: string;

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
}
