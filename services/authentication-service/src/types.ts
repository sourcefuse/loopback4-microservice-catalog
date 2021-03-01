import {IServiceConfig} from '@sourceloop/core';

export interface IAuthServiceConfig extends IServiceConfig {}

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

export interface PreSignupFn<T = void> {
  (token: string, email: string): Promise<T>;
}

export interface UserSignupFn<T> {
  (model: T): Promise<T>;
}
