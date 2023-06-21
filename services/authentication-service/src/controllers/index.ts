// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AppleLoginController} from '../modules/auth/apple-login.controller';
import {FacebookLoginController} from '../modules/auth/facebook-login.controller';
import {GoogleLoginController} from '../modules/auth/google-login.controller';
import {InstagramLoginController} from '../modules/auth/instagram-login.controller';
import {KeycloakLoginController} from '../modules/auth/keycloak-login.controller';
import {LoginController} from '../modules/auth/login.controller';
import {LogoutController} from '../modules/auth/logout.controller';
import {ForgetPasswordController} from './forget-password.controller';
import {OtpController} from '../modules/auth/otp.controller';
import {SignupRequestController} from './signup-request.controller';
import {AzureLoginController} from '../modules/auth/azure-login.controller';
import {CognitoLoginController} from '../modules/auth/cognito-login.controller';
import {SamlLoginController} from '../modules/auth/saml-login.controller';
import {LoginActivityController} from './login-activity.controller';

export * from '../modules/auth/login.controller';
export * from '../modules/auth/logout.controller';
export * from '../modules/auth/otp.controller';
export * from './forget-password.controller';
export * from './signup-request.controller';
export * from './login-activity.controller';

export const controllers = [
  LoginController,
  GoogleLoginController,
  FacebookLoginController,
  AppleLoginController,
  KeycloakLoginController,
  InstagramLoginController,
  LogoutController,
  OtpController,
  ForgetPasswordController,
  SignupRequestController,
  AzureLoginController,
  CognitoLoginController,
  SamlLoginController,
  LoginActivityController,
];
