﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */
import {IServiceConfig} from '@sourceloop/core';
import {STRATEGY} from 'loopback4-authentication';

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

export type FindAccountProviderFn = (
  ctx: unknown,
  sub: string,
  token: unknown,
) => Promise<FindAccountResult>;

export interface FindAccountResult {
  accountId: string;
  claims: (
    use: string,
    scope: string,
    claims: unknown,
    rejected: Array<string>,
  ) => Promise<{[key: string]: unknown}>;
}
