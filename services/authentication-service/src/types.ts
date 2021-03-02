import {IServiceConfig} from '@sourceloop/core';
import {SignupRequestDto} from './models/signup-request-dto.model';

export interface IAuthServiceConfig extends IServiceConfig {}

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PreSignupFn<T = any> {
  (request: SignupRequestDto): Promise<T>;
}

export interface UserSignupFn<T> {
  (model: T): Promise<T>;
}
