// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */
import {AnyObject} from '@loopback/repository';
import {IServiceConfig} from '@sourceloop/core';
import {STRATEGY} from 'loopback4-authentication';
import {OtpMethodType} from './enums';
import {LocalUserProfileDto} from './models';
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

export interface IOtpConfig {
  method: OtpMethodType;
}

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
