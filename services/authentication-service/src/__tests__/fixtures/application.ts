// Copyright (c) 2022 Sourcefuse Technologies
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
import {Strategies} from 'loopback4-authentication';
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
    this.service(TestHelperService, {defaultScope: BindingScope.SINGLETON});

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
