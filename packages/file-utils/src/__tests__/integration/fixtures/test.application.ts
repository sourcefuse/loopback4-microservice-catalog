import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {FileUtilComponent} from '../../../component';
import {Parent} from './models';
import {AWSS3Bindings} from 'loopback4-s3';

export class TestApp extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.model(Parent);
    this.bind(AWSS3Bindings.Config).to({
      secretAccessKey: process.env.AWS_SECRET ?? '',
      accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
      region: process.env.AWS_REGION ?? '',
    });
    this.component(FileUtilComponent);
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
