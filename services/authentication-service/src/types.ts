import {AnyObject} from '@loopback/repository';
import {IServiceConfig} from '@sourceloop/core';
import {SignupRequestDto} from './models/signup-request-dto.model';

export interface IAuthServiceConfig extends IServiceConfig {}

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

export interface PreSignupFn<T = AnyObject, S = AnyObject> {
  (request: SignupRequestDto<T>): Promise<S>;
}

export interface UserSignupFn<T, S=AnyObject> {
  (model: T): Promise<S>;
}
