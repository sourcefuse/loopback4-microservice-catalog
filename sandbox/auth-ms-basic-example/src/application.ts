// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
import {LocalPasswordStrategyFactoryProvider} from 'loopback4-authentication/passport-local';
import {
  AuthenticationServiceComponent,
  SignUpBindings,
} from '@sourceloop/authentication-service';
import path from 'node:path';
import {AzureAdSignupProvider} from './providers';
import {LocalSignupProvider} from './providers/local-signup.provider';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class AuthMultitenantExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.bind(Strategies.Passport.LOCAL_STRATEGY_FACTORY).toProvider(
      LocalPasswordStrategyFactoryProvider,
    );
    this.component(AuthenticationComponent);
    this.component(AuthenticationServiceComponent);
    this.bind(SignUpBindings.LOCAL_SIGNUP_PROVIDER).toProvider(
      LocalSignupProvider,
    );
    this.bind(SignUpBindings.AZURE_AD_SIGN_UP_PROVIDER).toProvider(
      AzureAdSignupProvider,
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
    };
  }
}
