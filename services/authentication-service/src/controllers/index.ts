// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ForgetPasswordController} from './forget-password.controller';
import {SignupRequestController} from './signup-request.controller';
import {LoginActivityController} from './login-activity.controller';
import {
  AppleLoginController,
  FacebookLoginController,
  GoogleLoginController,
  InstagramLoginController,
  KeycloakLoginController,
  LoginController,
  LogoutController,
  OtpController,
  AzureLoginController,
  CognitoLoginController,
  SamlLoginController,
} from '../modules/auth/controllers';

export * from '../modules/auth/controllers/login.controller';
export * from '../modules/auth/controllers/logout.controller';
export * from '../modules/auth/controllers/otp.controller';
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
