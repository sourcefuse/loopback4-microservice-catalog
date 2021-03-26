import {
  IAuthClient,
  IAuthUser,
  KeycloakProfile,
} from 'loopback4-authentication';
import * as GoogleStrategy from 'passport-google-oauth20';

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

export interface GoogleCodeWriterFn {
  (token: string): Promise<string>;
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

export interface KeyCloakCodeWriterFn {
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
