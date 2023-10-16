// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model()
export class User extends CoreEntity<User> {
  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  about: string;
}

export type UserWithRelations = User;
