// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {AnyObject, DataObject} from '@loopback/repository';
import * as SamlStrategy from '@node-saml/passport-saml';
import {SignOptions, VerifyOptions} from 'jsonwebtoken';
import {
  Cognito,
  IAuthClient,
  IAuthUser,
  Keycloak,
} from 'loopback4-authentication';
import * as AppleStrategy from 'passport-apple';
import * as Auth0Strategy from 'passport-auth0';
import * as AzureADStrategy from 'passport-azure-ad';
import * as FacebookStrategy from 'passport-facebook';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as InstagramStrategy from 'passport-instagram';
import {
  AuthClient,
  ForgetPasswordResponseDto,
  SignupRequestResponseDto,
  User,
  UserRelations,
} from '../models';
import {AuthRefreshTokenRequest, AuthUser, OtpResponse} from '../modules/auth';

export type GoogleSignUpFn = (
  profile: GoogleStrategy.Profile,
) => Promise<(User & UserRelations) | null>;

export type GooglePreVerifyFn = (
  accessToken: string,
  refreshToken: string,
  profile: GoogleStrategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type GooglePostVerifyFn = (
  profile: GoogleStrategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;
export type AuthenticationProviderFn = (
  accessToken: string,
  req?: AuthRefreshTokenRequest,
  payload?: AnyObject,
) => Promise<boolean>;

export type PasswordDecryptionFn = (password: string) => Promise<string>;
export type PasswordHashingFn = (
  password?: string,
  key?: string,
) => Promise<string>;
export type PasswordVerifyFn = (
  plainPassword: string,
  hashedPassword: string,
  key?: string,
) => Promise<boolean>;
export type InstagramSignUpFn = (
  profile: InstagramStrategy.Profile,
) => Promise<(User & UserRelations) | null>;

export type InstagramPreVerifyFn = (
  accessToken: string,
  refreshToken: string,
  profile: InstagramStrategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type InstagramPostVerifyFn = (
  profile: InstagramStrategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type AppleSignUpFn = (
  profile: AppleStrategy.Profile,
) => Promise<(User & UserRelations) | null>;

export type ApplePreVerifyFn = (
  accessToken: string,
  refreshToken: string,
  profile: AppleStrategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type ApplePostVerifyFn = (
  profile: AppleStrategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type FacebookSignUpFn = (
  profile: FacebookStrategy.Profile,
) => Promise<(User & UserRelations) | null>;

export type FacebookPreVerifyFn = (
  accessToken: string,
  refreshToken: string,
  profile: FacebookStrategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type FacebookPostVerifyFn = (
  profile: FacebookStrategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type KeyCloakSignUpFn = (
  profile: Keycloak.Profile,
) => Promise<IAuthUser | null>;

export type KeyCloakPreVerifyFn = (
  accessToken: string,
  refreshToken: string,
  profile: Keycloak.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type KeyCloakPostVerifyFn = (
  profile: Keycloak.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type CodeWriterFn = (token: string) => Promise<string>;
export type CodeReaderFn = (token: string) => Promise<string>;

export interface IDeviceInfo {
  userAgent?: string;
  deviceId?: string;
}

export type JwtPayloadFn = (
  user: IAuthUser,
  authClient: IAuthClient,
  tenantId?: string,
) => Promise<object>;

export type ForgotPasswordHandlerFn = (
  dto: DataObject<ForgetPasswordResponseDto>,
) => Promise<unknown>;

export type AuthCodeGeneratorFn = (
  client: AuthClient,
  user: AuthUser,
) => Promise<string>;

export type MfaCheckFn = (user: AuthUser) => Promise<boolean>;

export type OtpGenerateFn = (secret: string) => Promise<string>;

export type OtpFn = (user: User) => Promise<OtpResponse>;

export type OtpSenderFn = (otp: string, user: User) => Promise<void>;

export type SignupTokenHandlerFn = (
  dto: DataObject<SignupRequestResponseDto>,
) => Promise<void>;

export type AzureAdSignUpFn = (
  profile: AzureADStrategy.IProfile,
) => Promise<(User & UserRelations) | null>;

export type AzureAdPreVerifyFn = (
  accessToken: string,
  refreshToken: string,
  profile: AzureADStrategy.IProfile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type AzureAdPostVerifyFn = (
  profile: AzureADStrategy.IProfile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type CognitoPreVerifyFn = (
  accessToken: string,
  refreshToken: string,
  profile: Cognito.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type CognitoPostVerifyFn = (
  profile: Cognito.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type CognitoSignUpFn = (
  profile: Cognito.Profile,
) => Promise<(User & UserRelations) | null>;

export type JWTSignerFn<T> = (
  payload: T,
  options: SignOptions,
) => Promise<string>;
export type JWTVerifierFn<T> = (
  token: string,
  options: VerifyOptions,
) => Promise<T>;
export type SamlSignUpFn = (
  profile: SamlStrategy.Profile,
) => Promise<(User & UserRelations) | null>;

export type SamlPreVerifyFn = (
  profile: SamlStrategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type SamlPostVerifyFn = (
  profile: SamlStrategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type Auth0SignUpFn = (
  profile: Auth0Strategy.Profile,
) => Promise<(User & UserRelations) | null>;

export type Auth0PreVerifyFn = (
  accessToken: string,
  refreshToken: string,
  profile: Auth0Strategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;

export type Auth0PostVerifyFn = (
  profile: Auth0Strategy.Profile,
  user: IAuthUser | null,
) => Promise<IAuthUser | null>;
