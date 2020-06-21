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
} from '@sourceloop/core';
import {
  SchedulerBindings,
  SchedulerServiceComponent,
} from '@sourceloop/scheduler-service';
import * as dotenv from 'dotenv';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import * as path from 'path';
import {AuthorizeActionProvider} from './providers/authorization-action.provider';
export {ApplicationConfig};

export class TestingApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    super(options);

    // Set up the custom sequence
    // this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bind(SchedulerBindings.Config).to({
      jwtIssuer: 'rashi',
      jwtSecret: 'kdskssdkdfs',
      identifierMappedTo: 'test_field',
    });

    this.component(SchedulerServiceComponent);

    this.component(AuthenticationComponent);

    // Add bearer verifier component
    this.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.component(BearerVerifierComponent);

    this.component(AuthorizationComponent);
    this.bind(AuthorizationBindings.AUTHORIZE_ACTION).toProvider(
      AuthorizeActionProvider,
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
