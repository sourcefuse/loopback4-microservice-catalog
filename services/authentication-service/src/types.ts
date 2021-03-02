import {IServiceConfig} from '@sourceloop/core';
import {LocalUserProfileDto} from './models';
import {SignupRequestDto} from './models/signup-request-dto.model';

export interface IAuthServiceConfig extends IServiceConfig {}

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PreSignupFn<T = any, S = any> {
  (request: SignupRequestDto<T>): Promise<S>;
}

export interface UserSignupFn<
  T extends LocalUserProfileDto,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S = any
> {
  (model: T): Promise<S>;
}
