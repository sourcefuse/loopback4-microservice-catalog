// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  AppleLoginController,
  Auth0LoginController,
  AzureLoginController,
  CognitoLoginController,
  FacebookLoginController,
  GoogleLoginController,
  IdentityServerController,
  InstagramLoginController,
  KeycloakLoginController,
  LoginController,
  LogoutController,
  OtpController,
  SamlLoginController,
} from '../modules/auth/controllers';
import {ForgetPasswordController} from './forget-password.controller';
import {LoginActivityController} from './login-activity.controller';
import {SignupRequestController} from './signup-request.controller';

export * from '../modules/auth/controllers/identity-server.controller';
export * from '../modules/auth/controllers/login.controller';
export * from '../modules/auth/controllers/logout.controller';
export * from '../modules/auth/controllers/otp.controller';
export * from './forget-password.controller';
export * from './login-activity.controller';
export * from './signup-request.controller';

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
  Auth0LoginController,
  LoginActivityController,
  IdentityServerController,
];
