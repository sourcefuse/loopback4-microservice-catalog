import {BaseEntity} from '@sourceloop/core';
import {model, property, belongsTo} from '@loopback/repository';
import {User, UserWithRelations} from './index';

@model({
  name: 'user_credentials',
  settings: {
    defaultIdSort: false,
  },
})
export class UserCredentials extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
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
  })
  password?: string;

  @belongsTo(
    () => User,
    {name: 'user'},
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
