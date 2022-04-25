import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {
  RequestBindings,
  RequestComponent,
  fetchClient
} from '@sourceloop/loopback4-fetch-client';
import { ResponseFormat } from './utils/response.fomatter';
import { ResponseFormatBindings } from './keys';

export { ApplicationConfig };

export class OcrServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {

    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: true,
      includeProcessEnv: true,
    });

    super(options);

    this.bind(ResponseFormatBindings.FORMAT_RESPONSE).toClass(ResponseFormat);


    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(RequestComponent);

    this.bind(RequestBindings.Config).to({
      baseUrl: process.env.CLM_ML_BASE_URL ?? '',
      json: true
    });

    this.bind(RequestBindings.FetchProvider).toProvider(fetchClient);

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
