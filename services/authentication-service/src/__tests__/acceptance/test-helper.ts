// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {AuthenticationBindings, Strategies} from 'loopback4-authentication';
import {OtpGenerateProvider, OtpProvider, VerifyBindings} from '../..';
import {
  ClientPasswordVerifyProvider,
  LocalPasswordVerifyProvider,
  OtpVerifyProvider,
  ResourceOwnerVerifyProvider,
} from '../../modules/auth';
import {AuthCacheSourceName, AuthDbSourceName} from '../../types';
import {TestingApplication} from '../fixtures/application';
import {OtpSenderProvider} from '../fixtures/providers/otp-sender.provider';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({});

  const app = new TestingApplication({
    rest: restConfig,
  });

  await app.boot();

  app.bind(`datasources.config.${AuthDbSourceName}`).to({
    name: AuthDbSourceName,
    connector: 'memory',
  });

  app.bind(`datasources.config.${AuthCacheSourceName}`).to({
    name: 'redis',
    connector: 'kv-memory',
  });

  app.bind(AuthenticationBindings.CURRENT_USER).to({
    id: 1,
    username: 'test_user',
    password: 'temp123!@',
  });

  app
    .bind(Strategies.Passport.LOCAL_PASSWORD_VERIFIER)
    .toProvider(LocalPasswordVerifyProvider);

  app
    .bind(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER)
    .toProvider(ClientPasswordVerifyProvider);

  app
    .bind(Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER)
    .toProvider(ResourceOwnerVerifyProvider);

  app
    .bind(VerifyBindings.OTP_GENERATE_PROVIDER)
    .toProvider(OtpGenerateProvider);
  app.bind(VerifyBindings.OTP_PROVIDER).toProvider(OtpProvider);
  app.bind(VerifyBindings.OTP_SENDER_PROVIDER).toProvider(OtpSenderProvider);
  app.bind(Strategies.Passport.OTP_VERIFIER).toProvider(OtpVerifyProvider);

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: TestingApplication;
  client: Client;
}
