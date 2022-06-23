/* eslint-disable  @typescript-eslint/naming-convention */
import {AnyObject} from '@loopback/repository';
import {IServiceConfig} from '@sourceloop/core';
import {LocalUserProfileDto} from './models';
import {SignupRequestDto} from './models/signup-request-dto.model';

export interface IAuthServiceConfig extends IServiceConfig {
  //do nothing
}

export interface IOtpAuthConfig {
  useGoogleAuthenticator: boolean;
}

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

export interface PreSignupFn<T, S> {
  (request: SignupRequestDto<T>): Promise<S>;
}

export interface UserSignupFn<T, S> {
  (model: T & LocalUserProfileDto, tokenInfo?: AnyObject): Promise<S>;
}

export interface IAuthClientDTO {
  // sonarignore:start
  client_id: string;
  client_secret: string;
  // sonarignore:end
}

export interface ExternalTokens {
  externalAuthToken?: string;
  externalRefreshToken?: string;
}
