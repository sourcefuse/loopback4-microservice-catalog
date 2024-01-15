import {Provider, ValueOrPromise} from '@loopback/core';
import {User} from '../types';

export class SystemUserProvider implements Provider<User> {
  value(): ValueOrPromise<User> {
    return {
      username: 'system',
      userTenantId: process.env.SYSTEM_USER_TENANT_ID!,
    };
  }
}
