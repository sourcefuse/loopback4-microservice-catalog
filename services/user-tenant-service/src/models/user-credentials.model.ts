// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BaseEntity} from '@sourceloop/core';
import {model, property, belongsTo} from '@loopback/repository';
import {User, UserWithRelations} from './index';

@model({
  name: 'user_credentials',
})
export class UserCredentials extends BaseEntity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    name: 'auth_provider',
    type: 'string',
    required: true,
  })
  authProvider: string;

  @property({
    name: 'auth_id',
    type: 'string',
  })
  authId?: string;

  @property({
    name: 'auth_token',
    type: 'string',
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

  @belongsTo(
    () => User,
    {keyFrom: 'user_id', name: 'user'},
    {
      name: 'user_id',
      required: true,
    },
  )
  userId: string;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

export interface UserCredentialsRelations {
  user: UserWithRelations;
}

export type UserCredentialsWithRelations = UserCredentials &
  UserCredentialsRelations;
