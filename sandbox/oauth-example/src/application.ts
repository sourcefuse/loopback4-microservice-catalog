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
import {
  AuthenticationServiceComponent,
  SignUpBindings,
} from '@sourceloop/authentication-service';
import {Strategies} from 'loopback4-authentication';
import {SamlStrategyFactoryProvider} from 'loopback4-authentication/SAML';
import {GoogleAuthStrategyFactoryProvider} from 'loopback4-authentication/passport-google-oauth2';
import {LocalPasswordStrategyFactoryProvider} from 'loopback4-authentication/passport-local';
import path from 'path';
import {
  AzureAdSignupProvider,
  FacebookOauth2SignupProvider,
  GoogleOauth2SignupProvider,
  SamlVerifyProvider,
} from './providers';
import {SamlSignupProvider} from './providers/saml-signup.provider';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class AuthServiceApplication extends BootMixin(
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

    this.component(AuthenticationServiceComponent);

    this.bind(Strategies.Passport.LOCAL_STRATEGY_FACTORY.key).toProvider(
      LocalPasswordStrategyFactoryProvider,
    );

    this.bind(SignUpBindings.GOOGLE_SIGN_UP_PROVIDER).toProvider(
      GoogleOauth2SignupProvider,
    );
    this.bind(
      Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY.key,
    ).toProvider(GoogleAuthStrategyFactoryProvider);
    this.bind(SignUpBindings.FACEBOOK_SIGN_UP_PROVIDER).toProvider(
      FacebookOauth2SignupProvider,
    );
    this.bind(SignUpBindings.AZURE_AD_SIGN_UP_PROVIDER).toProvider(
      AzureAdSignupProvider,
    );

    this.bind(SignUpBindings.SAML_SIGN_UP_PROVIDER).toProvider(
      SamlSignupProvider,
    );

    this.bind(Strategies.Passport.SAML_VERIFIER).toProvider(SamlVerifyProvider);

    this.bind(Strategies.Passport.SAML_STRATEGY_FACTORY.key).toProvider(
      SamlStrategyFactoryProvider,
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
