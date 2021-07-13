import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {CoreComponent, SECURITY_SCHEME_SPEC} from '@sourceloop/core';
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';

import {controllers} from './controllers';
import {AuthServiceBindings} from './keys';
import {models} from './models';
import {
  BearerTokenVerifyProvider,
  ClientPasswordVerifyProvider,
  GoogleOauth2VerifyProvider,
  LocalPasswordVerifyProvider,
  ResourceOwnerVerifyProvider,
  AppleOauth2VerifyProvider,
  FacebookOauth2VerifyProvider,
} from './modules/auth';
import {repositories} from './repositories';
import {MySequence} from './sequence';
import {IAuthServiceConfig} from './types';
import {KeycloakVerifyProvider} from './modules/auth/providers/keycloak-verify.provider';
import {
  AuthCodeBindings,
  CodeWriterProvider,
  GoogleOauth2SignupProvider,
  GooglePostVerifyProvider,
  GooglePreVerifyProvider,
  InstagramOauth2SignupProvider,
  InstagramPostVerifyProvider,
  InstagramPreVerifyProvider,
  AppleOauth2SignupProvider,
  ApplePostVerifyProvider,
  ApplePreVerifyProvider,
  FacebookOauth2SignupProvider,
  FacebookPostVerifyProvider,
  FacebookPreVerifyProvider,
  JwtPayloadProvider,
  KeyCloakPostVerifyProvider,
  KeyCloakPreVerifyProvider,
  SignUpBindings,
  VerifyBindings,
} from './providers';
import {KeyCloakSignupProvider} from './providers/keycloak-signup.provider';
import {LocalSignupProvider} from './providers/local-signup.provider';
import {LocalPreSignupProvider} from './providers/local-presignup.provider';
import {SignupBearerVerifyProvider} from './providers/bearer-verify.provider';
import {OauthCodeReaderProvider} from './providers/code-reader.provider';

export class AuthenticationServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(AuthServiceBindings.Config, {optional: true})
    private readonly authConfig?: IAuthServiceConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    // Mount authentication component
    this.setupAuthenticationComponent();

    // Mount authorization component
    this.setupAuthorizationComponent();

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Authentication Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    // Mount default sequence if needed
    if (!this.authConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }

    this.repositories = repositories;

    this.models = models;

    this.controllers = controllers;
  }

  providers: ProviderMap = {};

  bindings: Binding[] = [];

  /**
   * An optional list of Repository classes to bind for dependency injection
   * via `app.repository()` API.
   */
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   *
   * @param bindings Binding array
   */
  setupSequence() {
    this.application.sequence(MySequence);
  }

  setupAuthenticationComponent() {
    // Add authentication component
    this.application.component(AuthenticationComponent);
    // Customize authentication verify handlers
    this.providers[Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER.key] =
      ClientPasswordVerifyProvider;
    this.providers[Strategies.Passport.LOCAL_PASSWORD_VERIFIER.key] =
      LocalPasswordVerifyProvider;
    this.providers[Strategies.Passport.BEARER_TOKEN_VERIFIER.key] =
      BearerTokenVerifyProvider;
    this.providers[Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER.key] =
      ResourceOwnerVerifyProvider;
    this.providers[Strategies.Passport.GOOGLE_OAUTH2_VERIFIER.key] =
      GoogleOauth2VerifyProvider;
    this.providers[Strategies.Passport.APPLE_OAUTH2_VERIFIER.key] =
      AppleOauth2VerifyProvider;
    this.providers[Strategies.Passport.FACEBOOK_OAUTH2_VERIFIER.key] =
      FacebookOauth2VerifyProvider;
    this.providers[Strategies.Passport.KEYCLOAK_VERIFIER.key] =
      KeycloakVerifyProvider;
    this.providers[SignUpBindings.KEYCLOAK_SIGN_UP_PROVIDER.key] =
      KeyCloakSignupProvider;
    this.providers[SignUpBindings.GOOGLE_SIGN_UP_PROVIDER.key] =
      GoogleOauth2SignupProvider;
    this.providers[SignUpBindings.INSTAGRAM_SIGN_UP_PROVIDER.key] =
      InstagramOauth2SignupProvider;
    this.providers[SignUpBindings.APPLE_SIGN_UP_PROVIDER.key] =
      AppleOauth2SignupProvider;
    this.providers[SignUpBindings.FACEBOOK_SIGN_UP_PROVIDER.key] =
      FacebookOauth2SignupProvider;
    this.providers[SignUpBindings.LOCAL_SIGNUP_PROVIDER.key] =
      LocalSignupProvider;
    this.providers[SignUpBindings.PRE_LOCAL_SIGNUP_PROVIDER.key] =
      LocalPreSignupProvider;
    this.providers[VerifyBindings.KEYCLOAK_PRE_VERIFY_PROVIDER.key] =
      KeyCloakPreVerifyProvider;
    this.providers[VerifyBindings.KEYCLOAK_POST_VERIFY_PROVIDER.key] =
      KeyCloakPostVerifyProvider;
    this.providers[VerifyBindings.GOOGLE_PRE_VERIFY_PROVIDER.key] =
      GooglePreVerifyProvider;
    this.providers[VerifyBindings.GOOGLE_POST_VERIFY_PROVIDER.key] =
      GooglePostVerifyProvider;
    this.providers[VerifyBindings.INSTAGRAM_PRE_VERIFY_PROVIDER.key] =
      InstagramPreVerifyProvider;
    this.providers[VerifyBindings.INSTAGRAM_POST_VERIFY_PROVIDER.key] =
      InstagramPostVerifyProvider;
    this.providers[VerifyBindings.APPLE_PRE_VERIFY_PROVIDER.key] =
      ApplePreVerifyProvider;
    this.providers[VerifyBindings.APPLE_POST_VERIFY_PROVIDER.key] =
      ApplePostVerifyProvider;
    this.providers[VerifyBindings.FACEBOOK_PRE_VERIFY_PROVIDER.key] =
      FacebookPreVerifyProvider;
    this.providers[VerifyBindings.FACEBOOK_POST_VERIFY_PROVIDER.key] =
      FacebookPostVerifyProvider;
    this.providers[VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER.key] =
      SignupBearerVerifyProvider;

    this.providers[AuthCodeBindings.CODEREADER_PROVIDER.key] =
      OauthCodeReaderProvider;
    this.providers[AuthCodeBindings.CODEWRITER_PROVIDER.key] =
      CodeWriterProvider;

    this.providers[AuthServiceBindings.JWTPayloadProvider.key] =
      JwtPayloadProvider;
  }

  setupAuthorizationComponent() {
    // Add authorization component
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}
