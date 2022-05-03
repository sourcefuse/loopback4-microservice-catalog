import {
  BootMixin
} from '@loopback/boot';
import {
  ApplicationConfig
} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {
  RepositoryMixin
} from '@loopback/repository';
import {
  RestApplication
} from '@loopback/rest';
import {
  ServiceMixin
} from '@loopback/service-proxy';
import path from 'path';
import {
  AWSS3Bindings,
  AwsS3Component,
  AwsS3Config
} from 'loopback4-s3';

export {
  ApplicationConfig
};

export class ClmS3ServiceApplication extends BootMixin(
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


    this.bind(AWSS3Bindings.Config).to({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      } as AwsS3Config);
    this.component(AwsS3Component);

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
  }
}