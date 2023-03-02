// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DataObject} from '@loopback/repository';
import {
  Cognito,
  IAuthClient,
  IAuthUser,
  Keycloak,
} from 'loopback4-authentication';
import * as AppleStrategy from 'passport-apple';
import * as FacebookStrategy from 'passport-facebook';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as InstagramStrategy from 'passport-instagram';
import * as AzureADStrategy from 'passport-azure-ad';
import * as SamlStrategy from '@node-saml/passport-saml';
import {
  AuthClient,
  ForgetPasswordResponseDto,
  SignupRequestResponseDto,
  User,
  UserRelations,
} from '../models';
import {AuthUser, OtpResponse} from '../modules/auth';
import {SignOptions, VerifyOptions} from 'jsonwebtoken';

export interface GoogleSignUpFn {
  (profile: GoogleStrategy.Profile): Promise<(User & UserRelations) | null>;
}

export interface GooglePreVerifyFn {
  (
    accessToken: string,
    refreshToken: string,
    profile: GoogleStrategy.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface GooglePostVerifyFn {
  (
    profile: GoogleStrategy.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface InstagramSignUpFn {
  (profile: InstagramStrategy.Profile): Promise<(User & UserRelations) | null>;
}

export interface InstagramPreVerifyFn {
  (
    accessToken: string,
    refreshToken: string,
    profile: InstagramStrategy.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface InstagramPostVerifyFn {
  (
    profile: InstagramStrategy.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface AppleSignUpFn {
  (profile: AppleStrategy.Profile): Promise<(User & UserRelations) | null>;
}

export interface ApplePreVerifyFn {
  (
    accessToken: string,
    refreshToken: string,
    profile: AppleStrategy.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface ApplePostVerifyFn {
  (
    profile: AppleStrategy.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface FacebookSignUpFn {
  (profile: FacebookStrategy.Profile): Promise<(User & UserRelations) | null>;
}

export interface FacebookPreVerifyFn {
  (
    accessToken: string,
    refreshToken: string,
    profile: FacebookStrategy.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface FacebookPostVerifyFn {
  (
    profile: FacebookStrategy.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface KeyCloakSignUpFn {
  (profile: Keycloak.Profile): Promise<IAuthUser | null>;
}

export interface KeyCloakPreVerifyFn {
  (
    accessToken: string,
    refreshToken: string,
    profile: Keycloak.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface KeyCloakPostVerifyFn {
  (
    profile: Keycloak.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface CodeWriterFn {
  (token: string): Promise<string>;
}

export interface CodeReaderFn {
  (token: string): Promise<string>;
}

export interface IDeviceInfo {
  userAgent?: string;
  deviceId?: string;
}

export interface JwtPayloadFn {
  (user: IAuthUser, authClient: IAuthClient): Promise<object>;
}

export interface ForgotPasswordHandlerFn {
  (dto: DataObject<ForgetPasswordResponseDto>): Promise<unknown>;
}

export interface AuthCodeGeneratorFn {
  (client: AuthClient, user: AuthUser): Promise<string>;
}
export interface MfaCheckFn {
  (user: AuthUser): Promise<boolean>;
}

export interface OtpGenerateFn {
  (secret: string): Promise<string>;
}

export interface OtpFn {
  (user: User): Promise<OtpResponse>;
}

export interface OtpSenderFn {
  (otp: string, user: User): Promise<void>;
}

export interface SignupTokenHandlerFn {
  (dto: DataObject<SignupRequestResponseDto>): Promise<void>;
}

export interface AzureAdSignUpFn {
  (profile: AzureADStrategy.IProfile): Promise<(User & UserRelations) | null>;
}

export interface AzureAdPreVerifyFn {
  (
    accessToken: string,
    refreshToken: string,
    profile: AzureADStrategy.IProfile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface AzureAdPostVerifyFn {
  (
    profile: AzureADStrategy.IProfile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface CognitoPreVerifyFn {
  (
    accessToken: string,
    refreshToken: string,
    profile: Cognito.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface CognitoPostVerifyFn {
  (profile: Cognito.Profile, user: IAuthUser | null): Promise<IAuthUser | null>;
}

export interface CognitoSignUpFn {
  (profile: Cognito.Profile): Promise<(User & UserRelations) | null>;
}
export type JWTSignerFn<T> = (
  payload: T,
  options: SignOptions,
) => Promise<string>;
export type JWTVerifierFn<T> = (
  token: string,
  options: VerifyOptions,
) => Promise<T>;
export interface SamlSignUpFn {
  (profile: SamlStrategy.Profile): Promise<(User & UserRelations) | null>;
}

export interface SamlPreVerifyFn {
  (
    profile: SamlStrategy.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface SamlPostVerifyFn {
  (
    profile: SamlStrategy.Profile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}
