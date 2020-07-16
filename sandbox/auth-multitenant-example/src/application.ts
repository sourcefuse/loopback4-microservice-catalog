import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationServiceComponent} from '@sourceloop/authentication-service';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import path from 'path';

export {ApplicationConfig};

const port = 3000;
export class AuthMultitenantExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    if (process.env.NODE_ENV !== 'test') {
      dotenvExt.load({
        schema: '.env.example',
        errorOnMissing: true,
        includeProcessEnv: true,
      });
    } else {
      dotenvExt.load({
        schema: '.env.example',
        errorOnMissing: false,
        includeProcessEnv: true,
      });
    }
    options.rest = options.rest || {};
    options.rest.port = +(process.env.PORT ?? port);
    options.rest.host = process.env.HOST;
    super(options);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationServiceComponent);

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
