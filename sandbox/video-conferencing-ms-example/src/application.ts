import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {
  VideoConfServiceComponent,
  VonageBindings,
} from '@sourceloop/video-conferencing-service';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import * as path from 'path';
import {MySequence} from './sequence';

export {ApplicationConfig};

const timeToStart = 10;
const port = 3000;
export class VideoConferencingExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: true,
      includeProcessEnv: true,
    });
    options.rest = options.rest || {};
    options.rest.port = +(process.env.PORT ?? port);
    options.rest.host = process.env.HOST;
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

    this.component(VideoConfServiceComponent);

    this.bind(VonageBindings.config).to({
      apiKey: process.env.VONAGE_API_KEY ?? '',
      apiSecret: process.env.VONAGE_API_SECRET ?? '',
      timeToStart: Number(process.env.TIME_TO_START) || timeToStart,
    });

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
