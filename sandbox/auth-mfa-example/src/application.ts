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
  AuthServiceBindings,
  AuthenticationServiceComponent,
  OtpMethodType,
  VerifyBindings,
} from '@sourceloop/authentication-service';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  SECURITY_SCHEME_SPEC,
  SFCoreBindings,
  ServiceSequence,
} from '@sourceloop/core';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {
  AuthenticationComponent,
  STRATEGY,
  Strategies,
} from 'loopback4-authentication';
import {LocalPasswordStrategyFactoryProvider} from 'loopback4-authentication/passport-local';
import {PassportOtpStrategyFactoryProvider} from 'loopback4-authentication/passport-otp';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import path from 'path';
import * as openapi from './openapi.json';
import {MfaProvider} from './providers/mfa.provider';

export {ApplicationConfig};

export class AuthenticationApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    const port = 3000;
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: process.env.NODE_ENV !== 'test',
      includeProcessEnv: true,
    });
    options.rest = options.rest ?? {};
    options.rest.basePath = process.env.BASE_PATH ?? '';
    options.rest.port = +(process.env.PORT ?? port);
    options.rest.host = process.env.HOST;
    options.rest.openApiSpec = {
      endpointMapping: {
        [`${options.rest.basePath}/openapi.json`]: {
          version: '3.0.0',
          format: 'json',
        },
      },
    };

    super(options);

    // To check if monitoring is enabled from env or not
    const enableObf = !!+(process.env.ENABLE_OBF ?? 0);
    // To check if authorization is enabled for swagger stats or not
    const authentication =
      process.env.SWAGGER_USER && process.env.SWAGGER_PASSWORD ? true : false; //NOSONAR
    const obj = {
      enableObf,
      obfPath: process.env.OBF_PATH ?? '/obf',
      openapiSpec: openapi,
      authentication: authentication,
      swaggerUsername: process.env.SWAGGER_USER,
      swaggerPassword: process.env.SWAGGER_PASSWORD,
    };
    this.bind(SFCoreBindings.config).to(obj);

    // Set up the custom sequence
    this.sequence(ServiceSequence);
   
    this.bind(AuthServiceBindings.MfaConfig).to({
      secondFactor: STRATEGY.OTP,
    });
    //This binding is for having Google MFA
    this.bind(AuthServiceBindings.OtpConfig).to({
      method: OtpMethodType.GOOGLE_AUTHENTICATOR,
    });
    // This binding is to have MFA authentication

    this.bind(Strategies.Passport.LOCAL_STRATEGY_FACTORY.key).toProvider(
      LocalPasswordStrategyFactoryProvider,
    );

    this.bind(Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY.key).toProvider(
      PassportOtpStrategyFactoryProvider,
    );

    // Add authentication component
    this.component(AuthenticationComponent);
    this.component(AuthenticationServiceComponent);
    this.bind(VerifyBindings.MFA_PROVIDER.key).toProvider(MfaProvider);
    // Add bearer verifier component
    this.bind(BearerVerifierBindings.Config).to({
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.component(BearerVerifierComponent);
    // Add authorization component
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer', '/openapi.json'],
    });
    this.component(AuthorizationComponent);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    //This binding is for having OTP authentication

    this.component(RestExplorerComponent);

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

    this.api({
      openapi: '3.0.0',
      info: {
        title: 'authentication',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });
  }
}
