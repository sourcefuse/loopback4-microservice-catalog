// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */
import {AnyObject} from '@loopback/repository';
import {IServiceConfig} from '@sourceloop/core';
import {STRATEGY} from 'loopback4-authentication';
import {OtpMethodType} from './enums';
import {LocalUserProfileDto, UserTenant, LoginActivity} from './models';
import {SignupRequestDto} from './models/signup-request-dto.model';

// sonarignore:start
export interface IAuthServiceConfig extends IServiceConfig {
  //do nothing
}
// sonarignore:end

export const AuthDbSourceName = 'AuthDB';
export const AuthCacheSourceName = 'AuthCache';

export interface IMfaConfig {
  secondFactor: STRATEGY;
}

export interface IUserActivity {
  markUserActivity: boolean;
}
export interface IOtpConfig {
  method: OtpMethodType;
}

export type PreSignupFn<T, S> = (request: SignupRequestDto<T>) => Promise<S>;

export type UserSignupFn<T, S> = (
  model: T & LocalUserProfileDto,
  tokenInfo?: AnyObject,
) => Promise<S>;

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

export type ActorId = Extract<keyof UserTenant, string>;

export interface ActiveUsersGroupData {
  [key: string]: {
    [loginType: string]: Array<LoginActivity>;
  };
}
