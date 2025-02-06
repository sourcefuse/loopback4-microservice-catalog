// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {JwtKeysRepository, PublicKeysRepository} from '@sourceloop/core';
import {Strategies} from 'loopback4-authentication';
import {LocalPasswordStrategyFactoryProvider} from 'loopback4-authentication/passport-local';
import {PassportOtpStrategyFactoryProvider} from 'loopback4-authentication/passport-otp';
import * as path from 'path';
import {AuthenticationServiceComponent} from '../../component';
import {AuthServiceBindings} from '../../keys';
import {SignUpBindings} from '../../providers';
import {
  TestForgotPasswordTokenHandlerProvider,
  TestSignupTokenHandlerProvider,
} from './providers';
import {BearerTokenVerifyProvider} from './providers/bearer-token-verifier.provider';
import {TestHelperService} from './services';

export {ApplicationConfig};

export class TestingApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(AuthenticationServiceComponent);

    // Customize authentication verify handlers
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider,
    );
    this.bind(SignUpBindings.SIGNUP_HANDLER_PROVIDER).toProvider(
      TestSignupTokenHandlerProvider,
    );
    this.bind(AuthServiceBindings.ForgotPasswordHandler).toProvider(
      TestForgotPasswordTokenHandlerProvider,
    );
    this.bind(Strategies.Passport.LOCAL_STRATEGY_FACTORY.key).toProvider(
      LocalPasswordStrategyFactoryProvider,
    );
    this.bind(Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY.key).toProvider(
      PassportOtpStrategyFactoryProvider,
    );
    this.service(TestHelperService, {defaultScope: BindingScope.SINGLETON});

    // add multiple repositories
    this.bind('repositories.JwtKeysRepository').toClass(JwtKeysRepository);
    this.bind('repositories.PublicKeysRepository').toClass(
      PublicKeysRepository,
    );

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      repositories: {
        dirs: ['repositories'],
        extensions: ['.repository.js'],
        nested: true,
      },
    };
  }
}
