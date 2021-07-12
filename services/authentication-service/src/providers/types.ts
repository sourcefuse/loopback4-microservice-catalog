import {
  IAuthClient,
  IAuthUser,
  KeycloakProfile,
} from 'loopback4-authentication';
import * as GoogleStrategy from 'passport-google-oauth20';
import * as InstagramStrategy from 'passport-instagram';
import * as AppleStrategy from 'passport-apple';
import * as FacebookStrategy from 'passport-facebook';

import {User, UserRelations} from '../models';

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
  (profile: KeycloakProfile): Promise<IAuthUser | null>;
}

export interface KeyCloakPreVerifyFn {
  (
    accessToken: string,
    refreshToken: string,
    profile: KeycloakProfile,
    user: IAuthUser | null,
  ): Promise<IAuthUser | null>;
}

export interface KeyCloakPostVerifyFn {
  (profile: KeycloakProfile, user: IAuthUser | null): Promise<IAuthUser | null>;
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
  (
    user: IAuthUser,
    authClient: IAuthClient,
    deviceInfo?: IDeviceInfo,
  ): Promise<object>;
}
