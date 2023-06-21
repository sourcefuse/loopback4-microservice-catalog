import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {TestModel, TestRepo} from '.';
import {TenantUtilitiesComponent} from '../../../components/tenant-utilities/component';
import {TestWithoutGuardRepo} from './test-without-guard.repository';

export class DummyApp extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.repository(TestWithoutGuardRepo);
    this.repository(TestRepo);
    this.model(TestModel);
    this.component(TenantUtilitiesComponent);

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
