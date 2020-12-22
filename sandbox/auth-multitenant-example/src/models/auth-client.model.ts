import {model, property} from '@loopback/repository';
import {IAuthClient} from 'loopback4-authentication';
import {BaseEntity} from '@sourceloop/core';

@model({
  name: 'auth_clients',
})
export class AuthClient extends BaseEntity implements IAuthClient {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id: number;

  @property({
    name: 'client_id',
    type: 'string',
    required: true,
  })
  clientId: string;

  @property({
    name: 'client_secret',
    type: 'string',
  })
  clientSecret: string;

  @property({
    type: 'string',
    name: 'redirect_url',
  })
  redirectUrl?: string;

  @property({
    type: 'string',
    required: true,
  })
  secret: string;

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
