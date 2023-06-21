// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {ClientType, IAuthSecureClient} from 'loopback4-authentication';
import {AuthClient} from './auth-client.model';

@model({
  name: 'auth_clients',
})
export class AuthSecureClient extends AuthClient implements IAuthSecureClient {
  @property({
    type: 'string',
    name: 'client_type',
  })
  clientType: ClientType;

  constructor(data?: Partial<AuthSecureClient>) {
    super(data);
  }
}
