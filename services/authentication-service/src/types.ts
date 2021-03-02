import {IServiceConfig} from '@sourceloop/core';
import {SignupRequestDto} from './models/signup-request-dto.model';

export interface IAuthServiceConfig extends IServiceConfig {}

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

export interface PreSignupFn<T = void> {
  (request: SignupRequestDto): Promise<T>;
}

export interface UserSignupFn<T> {
  (model: T): Promise<T>;
}
