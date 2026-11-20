// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable  @typescript-eslint/naming-convention */
import {AnyObject} from '@loopback/repository';
import type {SamlConfig} from '@node-saml/passport-saml';
import {IServiceConfig} from '@sourceloop/core';
import {STRATEGY} from 'loopback4-authentication';
import {OtpMethodType} from './enums';
import {LocalUserProfileDto, LoginActivity, UserTenant} from './models';
import {SignupRequestDto} from './models/signup-request-dto.model';
import {AuthRefreshTokenRequest} from './modules/auth';

// sonarignore:start
export interface IAuthServiceConfig extends IServiceConfig {
  useSymmetricEncryption?: boolean;
  /**
   * Opt in to SAML Single Logout (off by default). When enabled, the
   * POST /saml/logout and POST /auth/saml/logout routes are mounted and the IdP
   * session reference is kept at login. Note that Single Logout ends the
   * user's IdP session, which for a corporate SSO signs them out of every
   * other application using it — enable it only where that is intended.
   */
  samlSingleLogout?: boolean;
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
export type UserValidationFn = (
  req: AuthRefreshTokenRequest,
  payload: AnyObject,
  signUpProvider: string,
  token?: string,
) => Promise<boolean>;
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

/**
 * IdP session identifiers kept for SP-initiated SAML Single Logout. They are
 * stored in the refresh-token record's externalAuthToken (never in the JWT)
 * so the LogoutRequest can name the exact IdP session to end.
 */
export interface SamlSessionRef {
  nameID: string;
  nameIDFormat: string;
  sessionIndex?: string;
  // qualifiers of a qualified NameID (e.g. affiliation-scoped persistent IDs);
  // the LogoutRequest must repeat them or the IdP won't recognise the principal
  nameQualifier?: string;
  spNameQualifier?: string;
}

/** SP-initiated SAML Single Logout settings. */
export interface SamlLogoutConfig {
  samlOptions: SamlConfig;
  postLogoutRedirectUrl: string;
  /** Server-side secret the session reference is encrypted with (the SP private key). */
  sessionSecret: string;
}

export type ActorId = Extract<keyof UserTenant, string>;

export interface ActiveUsersGroupData {
  [key: string]: {
    [loginType: string]: Array<LoginActivity>;
  };
}
