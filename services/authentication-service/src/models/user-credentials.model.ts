// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {belongsTo, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

import {User, UserWithRelations} from './user.model';

@model({
  name: 'user_credentials',
})
export class UserCredentials extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @belongsTo(
    () => User,
    {keyFrom: 'user_id', name: 'user'},
    {
      name: 'user_id',
      required: true,
    },
  )
  userId: string;

  @property({
    type: 'string',
    required: true,
    name: 'auth_provider',
  })
  authProvider: string;

  @property({
    type: 'string',
    name: 'auth_id',
  })
  authId?: string;

  @property({
    type: 'string',
    name: 'auth_token',
  })
  authToken?: string;

  @property({
    type: 'string',
    name: 'secret_key',
    description: 'Secret for Authenticator app',
  })
  secretKey?: string;

  @property({
    type: 'string',
  })
  password?: string;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

export interface UserCredentialsRelations {
  user: UserWithRelations;
}

export type UserCredentialsWithRelations = UserCredentials &
  UserCredentialsRelations;
