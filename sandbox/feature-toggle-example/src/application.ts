import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {
  FeatureToggleServiceComponent,
  TenantStrategy,
  UNLEASH_CONST,
  UserStrategy,
} from '@sourceloop/feature-toggle-service';
import {FeatureToggleBindings} from './keys';
import {RoleFeatureProvider} from './providers';
import {RoleStrategy} from './strategies';
const unleash = require('unleash-client');
export {ApplicationConfig};
require('dotenv').config();

export class FeatureToggleExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(FeatureToggleServiceComponent);
    unleash.initialize({
      url: process.env.UNLEASH_URL,
      appName: process.env.APP_NAME,
      environment: process.env.APP_ENV,
      customHeaders: {
        Authorization: process.env.UNLEASH_AUTH,
      },
    });
    this.bind(UNLEASH_CONST).to(unleash);

    this.bind(FeatureToggleBindings.ROLE_REATURE).toProvider(
      RoleFeatureProvider,
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
