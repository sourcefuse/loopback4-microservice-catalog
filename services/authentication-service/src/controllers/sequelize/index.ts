// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AppleLoginController} from '../../modules/auth/sequelize/apple-login.controller';
import {AzureLoginController} from '../../modules/auth/sequelize/azure-login.controller';
import {CognitoLoginController} from '../../modules/auth/sequelize/cognito-login.controller';
import {FacebookLoginController} from '../../modules/auth/sequelize/facebook-login.controller';
import {GoogleLoginController} from '../../modules/auth/sequelize/google-login.controller';
import {InstagramLoginController} from '../../modules/auth/sequelize/instagram-login.controller';
import {KeycloakLoginController} from '../../modules/auth/sequelize/keycloak-login.controller';
import {LoginController} from '../../modules/auth/sequelize/login.controller';
import {LogoutController} from '../../modules/auth/sequelize/logout.controller';
import {OtpController} from '../../modules/auth/sequelize/otp.controller';
import {SamlLoginController} from '../../modules/auth/sequelize/saml-login.controller';
import {ForgetPasswordController} from './forget-password.controller';
import {LoginActivityController} from './login-activity.controller';
import {SignupRequestController} from './signup-request.controller';

export * from '../../modules/auth/sequelize/login.controller';
export * from '../../modules/auth/sequelize/logout.controller';
export * from '../../modules/auth/sequelize/otp.controller';
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
  LoginActivityController,
];
