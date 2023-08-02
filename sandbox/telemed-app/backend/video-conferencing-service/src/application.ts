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
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreConfig,
  LocaleKey,
  SECURITY_SCHEME_SPEC,
  SFCoreBindings,
  ServiceSequence,
} from '@sourceloop/core';
import {VideoConfServiceComponent, VonageBindings} from '@sourceloop/video-conferencing-service';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import path from 'path';

export {ApplicationConfig};

export class VideoConferencingApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  localeObj: i18nAPI = {} as i18nAPI;
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
      process.env.SWAGGER_USER && process.env.SWAGGER_PASSWORD ? true : false;

    const configObject: CoreConfig['configObject'] = {
      locales: [
        LocaleKey.en,
        LocaleKey.es,
        LocaleKey.ptBr,
        LocaleKey.ptPt,
        LocaleKey.esCo,
      ],
      fallbacks: {
        [LocaleKey.es]: 'en',
        [LocaleKey.esCo]: 'en',
        [LocaleKey.ptBr]: 'en',
        [LocaleKey.ptPt]: 'en',
      },
      register: this.localeObj,
      directoryPermissions: '777',
      directory: `/tmp`,
      objectNotation: true,
    };

    this.bind(SFCoreBindings.config).to({configObject});


    // Set up the custom sequence
    this.sequence(ServiceSequence);

    // Add authentication component
    this.component(AuthenticationComponent);
    this.bind(VonageBindings.config).to({
      apiKey: process.env.VONAGE_API_KEY as string,
      apiSecret: process.env.VONAGE_API_SECRET as string,
      timeToStart: 0, // time in minutes, meeting can not be started 'timeToStart' minutes before the scheduled time
    });
    this.component(VideoConfServiceComponent);

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
        title: 'video-conferencing',
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
