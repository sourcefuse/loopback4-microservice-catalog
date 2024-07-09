// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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
import {
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  SFCoreBindings,
  TenantGuardService,
  TenantUtilitiesBindings,
} from '@sourceloop/core';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {
  AuthenticationBindings,
  AuthenticationComponent,
  AuthenticationConfig,
  Strategies,
  STRATEGY,
} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {controllers} from './controllers';
import {OtpMethodType} from './enums';
import {AuthServiceBindings} from './keys';
import {models} from './models';
import {
  AppleOauth2VerifyProvider,
  Auth0VerifyProvider,
  AuthUser,
  AzureAdVerifyProvider,
  BearerTokenVerifyProvider,
  ClientPasswordVerifyProvider,
  CognitoOauth2VerifyProvider,
  FacebookOauth2VerifyProvider,
  GoogleAuthenticatorVerifyProvider,
  GoogleOauth2VerifyProvider,
  LocalPasswordVerifyProvider,
  OtpVerifyProvider,
  ResourceOwnerVerifyProvider,
  SamlVerifyProvider,
  SecureClientPasswordVerifyProvider,
  SecureResourceOwnerVerifyProvider,
} from './modules/auth';
import {KeycloakVerifyProvider} from './modules/auth/providers/keycloak-verify.provider';
import {
  AppleOauth2SignupProvider,
  ApplePostVerifyProvider,
  ApplePreVerifyProvider,
  Auth0PostVerifyProvider,
  Auth0PreVerifyProvider,
  Auth0SignupProvider,
  AuthCodeBindings,
  AzureAdSignupProvider,
  AzurePostVerifyProvider,
  AzurePreVerifyProvider,
  CodeWriterProvider,
  CognitoAuthenticationProvider,
  CognitoOauth2SignupProvider,
  CognitoPostVerifyProvider,
  CognitoPreVerifyProvider,
  FacebookOauth2SignupProvider,
  FacebookPostVerifyProvider,
  FacebookPreVerifyProvider,
  ForgotPasswordProvider,
  GoogleOauth2SignupProvider,
  GooglePostVerifyProvider,
  GooglePreVerifyProvider,
  InstagramOauth2SignupProvider,
  InstagramPostVerifyProvider,
  InstagramPreVerifyProvider,
  JWTAsymmetricSignerProvider,
  JWTAsymmetricVerifierProvider,
  JwtPayloadProvider,
  JWTSymmetricSignerProvider,
  JWTSymmetricVerifierProvider,
  KeyCloakPostVerifyProvider,
  KeyCloakPreVerifyProvider,
  OtpGenerateProvider,
  OtpProvider,
  OtpSenderProvider,
  SamlPostVerifyProvider,
  SamlPreVerifyProvider,
  SamlSignupProvider,
  SignUpBindings,
  SignupTokenHandlerProvider,
  UserValidationServiceBindings,
  VerifyBindings,
} from './providers';
import {AuthCodeGeneratorProvider} from './providers/auth-code-generator.provider';
import {SignupBearerVerifyProvider} from './providers/bearer-verify.provider';
import {OauthCodeReaderProvider} from './providers/code-reader.provider';
import {KeyCloakSignupProvider} from './providers/keycloak-signup.provider';
import {LocalPreSignupProvider} from './providers/local-presignup.provider';
import {LocalSignupProvider} from './providers/local-signup.provider';
import {MfaProvider} from './providers/mfa.provider';
import {PasswordDecryptionProvider} from './providers/password-decryption.provider';

import {AzureAuthenticationProvider} from './providers/azure-authentication.provider';
import {DeafultAuthenticationProvider} from './providers/default-authentication.provider';
import {GoogleAuthenticationProvider} from './providers/google-authentication.provider';
import {KeycloakAuthenticationProvider} from './providers/keycloak-authentication.provider';
import {PasswordHashingProvider} from './providers/password-hashing.provider';
import {PasswordVerifyProvider} from './providers/password-verify.provider';
import {UserValidationProvider} from './providers/user-validation.provider';
import {repositories} from './repositories/index';
import {repositories as sequelizeRepositories} from './repositories/sequelize';
import {MySequence} from './sequence';
import {
  ActiveUserFilterBuilderService,
  IdpLoginService,
  LoginActivityHelperService,
  LoginHelperService,
  OtpService,
} from './services';
import {IAuthServiceConfig, IMfaConfig, IOtpConfig} from './types';

export class AuthenticationServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(AuthServiceBindings.MfaConfig, {optional: true})
    private readonly mfaConfig: IMfaConfig,
    @inject(AuthServiceBindings.OtpConfig, {optional: true})
    private readonly otpConfig: IOtpConfig,
    @inject(AuthServiceBindings.Config, {optional: true})
    private readonly authConfig?: IAuthServiceConfig,
    @inject(AuthenticationBindings.CONFIG, {optional: true})
    private readonly config?: AuthenticationConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    if (+(process.env.AZURE_AUTH_ENABLED ?? 0)) {
      const expressMiddlewares =
        this.application.getSync(SFCoreBindings.EXPRESS_MIDDLEWARES) ?? [];
      expressMiddlewares.push(cookieParser());
      expressMiddlewares.push(bodyParser.urlencoded({extended: true}));
      this.application
        .bind(SFCoreBindings.EXPRESS_MIDDLEWARES)
        .to(expressMiddlewares);
    }

    // Mount authentication component
    this.setupAuthenticationComponent(this.config?.secureClient);
    this.setupMultiFactorAuthentication();

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
    if (this.authConfig?.useSequelize) {
      this.repositories = sequelizeRepositories;
    } else {
      this.repositories = repositories;
    }

    this.application
      .bind('services.LoginHelperService')
      .toClass(LoginHelperService);
    this.application.bind('services.otpService').toClass(OtpService);
    this.application
      .bind('services.loginActivityHelperService')
      .toClass(LoginActivityHelperService);
    this.application.bind('services.IdpLoginService').toClass(IdpLoginService);

    //set the userActivity to false by default
    this.application
      .bind(AuthServiceBindings.MarkUserActivity)
      .to({markUserActivity: false});
    this.models = models;
    this.application
      .bind(TenantUtilitiesBindings.GuardService)
      .toClass(TenantGuardService);
    this.application
      .bind('services.ActiveUserFilterBuilderService')
      .toClass(ActiveUserFilterBuilderService);
    this.application.bind(AuthServiceBindings.ActorIdKey).to('userId');

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

  setupAuthenticationComponent(secureClient = false) {
    // Add authentication component
    this.application.component(AuthenticationComponent);

    // Customize authentication verify handlers

    if (!secureClient) {
      this.providers[Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER.key] =
        ClientPasswordVerifyProvider;
      this.providers[Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER.key] =
        ResourceOwnerVerifyProvider;
    } else {
      this.providers[Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER.key] =
        SecureClientPasswordVerifyProvider;
      this.providers[Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER.key] =
        SecureResourceOwnerVerifyProvider;
    }
    this.providers[Strategies.Passport.LOCAL_PASSWORD_VERIFIER.key] =
      LocalPasswordVerifyProvider;
    this.providers[Strategies.Passport.BEARER_TOKEN_VERIFIER.key] =
      BearerTokenVerifyProvider;
    this.providers[Strategies.Passport.GOOGLE_OAUTH2_VERIFIER.key] =
      GoogleOauth2VerifyProvider;
    this.providers[Strategies.Passport.SAML_VERIFIER.key] = SamlVerifyProvider;
    this.providers[Strategies.Passport.APPLE_OAUTH2_VERIFIER.key] =
      AppleOauth2VerifyProvider;
    this.providers[Strategies.Passport.FACEBOOK_OAUTH2_VERIFIER.key] =
      FacebookOauth2VerifyProvider;
    this.providers[Strategies.Passport.COGNITO_OAUTH2_VERIFIER.key] =
      CognitoOauth2VerifyProvider;
    this.providers[Strategies.Passport.KEYCLOAK_VERIFIER.key] =
      KeycloakVerifyProvider;
    this.providers[Strategies.Passport.AUTH0_VERIFIER.key] =
      Auth0VerifyProvider;
    this.providers[SignUpBindings.KEYCLOAK_SIGN_UP_PROVIDER.key] =
      KeyCloakSignupProvider;
    this.providers[SignUpBindings.GOOGLE_SIGN_UP_PROVIDER.key] =
      GoogleOauth2SignupProvider;
    this.providers[SignUpBindings.SAML_SIGN_UP_PROVIDER.key] =
      SamlSignupProvider;
    this.providers[SignUpBindings.INSTAGRAM_SIGN_UP_PROVIDER.key] =
      InstagramOauth2SignupProvider;
    this.providers[SignUpBindings.APPLE_SIGN_UP_PROVIDER.key] =
      AppleOauth2SignupProvider;
    this.providers[SignUpBindings.AUTH0_SIGN_UP_PROVIDER.key] =
      Auth0SignupProvider;
    this.providers[SignUpBindings.FACEBOOK_SIGN_UP_PROVIDER.key] =
      FacebookOauth2SignupProvider;
    this.providers[SignUpBindings.COGNITO_SIGN_UP_PROVIDER.key] =
      CognitoOauth2SignupProvider;
    this.providers[SignUpBindings.LOCAL_SIGNUP_PROVIDER.key] =
      LocalSignupProvider;
    this.providers[AuthServiceBindings.PASSWORD_DECRYPTION_PROVIDER.key] =
      PasswordDecryptionProvider;
    this.providers[AuthServiceBindings.PASSWORD_HASHING_PROVIDER.key] =
      PasswordHashingProvider;
    this.providers[AuthServiceBindings.PASSWORD_VERIFY_PROVIDER.key] =
      PasswordVerifyProvider;
    this.providers[SignUpBindings.PRE_LOCAL_SIGNUP_PROVIDER.key] =
      LocalPreSignupProvider;
    this.providers[SignUpBindings.SIGNUP_HANDLER_PROVIDER.key] =
      SignupTokenHandlerProvider;
    this.providers[VerifyBindings.KEYCLOAK_PRE_VERIFY_PROVIDER.key] =
      KeyCloakPreVerifyProvider;
    this.providers[VerifyBindings.KEYCLOAK_POST_VERIFY_PROVIDER.key] =
      KeyCloakPostVerifyProvider;
    this.providers[VerifyBindings.GOOGLE_PRE_VERIFY_PROVIDER.key] =
      GooglePreVerifyProvider;
    this.providers[VerifyBindings.GOOGLE_POST_VERIFY_PROVIDER.key] =
      GooglePostVerifyProvider;
    this.providers[VerifyBindings.SAML_PRE_VERIFY_PROVIDER.key] =
      SamlPreVerifyProvider;
    this.providers[VerifyBindings.SAML_POST_VERIFY_PROVIDER.key] =
      SamlPostVerifyProvider;
    this.providers[VerifyBindings.INSTAGRAM_PRE_VERIFY_PROVIDER.key] =
      InstagramPreVerifyProvider;
    this.providers[VerifyBindings.INSTAGRAM_POST_VERIFY_PROVIDER.key] =
      InstagramPostVerifyProvider;
    this.providers[VerifyBindings.APPLE_PRE_VERIFY_PROVIDER.key] =
      ApplePreVerifyProvider;
    this.providers[VerifyBindings.APPLE_POST_VERIFY_PROVIDER.key] =
      ApplePostVerifyProvider;
    this.providers[VerifyBindings.AUTH0_PRE_VERIFY_PROVIDER.key] =
      Auth0PreVerifyProvider;
    this.providers[VerifyBindings.AUTH0_POST_VERIFY_PROVIDER.key] =
      Auth0PostVerifyProvider;
    this.providers[VerifyBindings.FACEBOOK_PRE_VERIFY_PROVIDER.key] =
      FacebookPreVerifyProvider;
    this.providers[VerifyBindings.FACEBOOK_POST_VERIFY_PROVIDER.key] =
      FacebookPostVerifyProvider;
    this.providers[VerifyBindings.COGNITO_PRE_VERIFY_PROVIDER.key] =
      CognitoPreVerifyProvider;
    this.providers[VerifyBindings.COGNITO_POST_VERIFY_PROVIDER.key] =
      CognitoPostVerifyProvider;
    this.providers[VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER.key] =
      SignupBearerVerifyProvider;
    this.providers[AuthCodeBindings.CODEREADER_PROVIDER.key] =
      OauthCodeReaderProvider;
    this.providers[AuthCodeBindings.CODEWRITER_PROVIDER.key] =
      CodeWriterProvider;
    this.providers[AuthCodeBindings.AUTH_CODE_GENERATOR_PROVIDER.key] =
      AuthCodeGeneratorProvider;
    this.providers[UserValidationServiceBindings.VALIDATE_USER.key] =
      UserValidationProvider;
    this.providers[UserValidationServiceBindings.GOOGLE_AUTHENTICATION.key] =
      GoogleAuthenticationProvider;
    this.providers[UserValidationServiceBindings.KEYCLOAK_AUTHENTICATION.key] =
      KeycloakAuthenticationProvider;
    this.providers[UserValidationServiceBindings.AZURE_AD_AUTHENTICATION.key] =
      AzureAuthenticationProvider;
    this.providers[UserValidationServiceBindings.COGNITO_AUTHENTICATION.key] =
      CognitoAuthenticationProvider;
    this.providers[UserValidationServiceBindings.DEFAULT_AUTHENTICATION.key] =
      DeafultAuthenticationProvider;
    this.application.bind(AuthenticationBindings.USER_MODEL.key).to(AuthUser);

    this.providers[AuthCodeBindings.JWT_SIGNER.key] =
      JWTAsymmetricSignerProvider;
    this.providers[AuthCodeBindings.JWT_VERIFIER.key] =
      JWTAsymmetricVerifierProvider;

    if (this.authConfig?.useSymmetricEncryption) {
      this.providers[AuthCodeBindings.JWT_SIGNER.key] =
        JWTSymmetricSignerProvider;
      this.providers[AuthCodeBindings.JWT_VERIFIER.key] =
        JWTSymmetricVerifierProvider;
    }
    this.providers[AuthServiceBindings.JWTPayloadProvider.key] =
      JwtPayloadProvider;
    this.providers[AuthServiceBindings.ForgotPasswordHandler.key] =
      ForgotPasswordProvider;

    this.providers[Strategies.Passport.AZURE_AD_VERIFIER.key] =
      AzureAdVerifyProvider;
    this.providers[SignUpBindings.AZURE_AD_SIGN_UP_PROVIDER.key] =
      AzureAdSignupProvider;
    this.providers[VerifyBindings.AZURE_AD_PRE_VERIFY_PROVIDER.key] =
      AzurePreVerifyProvider;
    this.providers[VerifyBindings.AZURE_AD_POST_VERIFY_PROVIDER.key] =
      AzurePostVerifyProvider;
  }

  setupAuthorizationComponent() {
    // Add authorization component
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }

  setupMultiFactorAuthentication() {
    this.providers[VerifyBindings.MFA_PROVIDER.key] = MfaProvider;

    if (this.mfaConfig?.secondFactor === STRATEGY.OTP) {
      if (this.otpConfig?.method === OtpMethodType.OTP) {
        this.providers[VerifyBindings.OTP_GENERATE_PROVIDER.key] =
          OtpGenerateProvider;
        this.providers[VerifyBindings.OTP_SENDER_PROVIDER.key] =
          OtpSenderProvider;
        this.providers[VerifyBindings.OTP_PROVIDER.key] = OtpProvider;
        this.providers[Strategies.Passport.OTP_VERIFIER.key] =
          OtpVerifyProvider;
      } else if (
        this.otpConfig?.method === OtpMethodType.GOOGLE_AUTHENTICATOR
      ) {
        this.providers[Strategies.Passport.OTP_VERIFIER.key] =
          GoogleAuthenticatorVerifyProvider;
      } else {
        // do nothing
      }
    }
  }
}
