﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {IAuthClient} from 'loopback4-authentication';

@model({
  name: 'auth_clients',
})
export class AuthClient extends UserModifiableEntity implements IAuthClient {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'client_id',
  })
  clientId: string;

  @property({
    type: 'string',
    required: true,
    name: 'client_secret',
  })
  clientSecret: string;

  @property({
    type: 'string',
    description: 'Value can be a string or a private key.',
    required: true,
  })
  secret: string;

  @property({
    type: 'string',
    name: 'redirect_url',
  })
  redirectUrl?: string;

  @property({
    type: 'number',
    required: true,
    name: 'access_token_expiration',
  })
  accessTokenExpiration: number;

  @property({
    type: 'number',
    required: true,
    name: 'refresh_token_expiration',
  })
  refreshTokenExpiration: number;

  @property({
    type: 'number',
    required: true,
    name: 'auth_code_expiration',
  })
  authCodeExpiration: number;

  constructor(data?: Partial<AuthClient>) {
    super(data);
  }
}
