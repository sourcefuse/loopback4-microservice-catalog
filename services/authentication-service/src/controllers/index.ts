import {LoginController} from '../modules/auth/login.controller';
import {LogoutController} from '../modules/auth/logout.controller';
import {AuthClientController} from './auth-client.controller';
import {ForgetPasswordController} from './forget-password.controller';
import {OtpController} from './otp.controller';

export * from '../modules/auth/login.controller';
export * from '../modules/auth/logout.controller';
export * from './otp.controller';
export * from './auth-client.controller';
export * from './forget-password.controller';

export const controllers = [
  LoginController,
  LogoutController,
  OtpController,
  AuthClientController,
  ForgetPasswordController,
];
