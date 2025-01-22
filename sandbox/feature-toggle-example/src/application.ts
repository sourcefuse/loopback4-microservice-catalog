// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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
  FeatureToggleBindings,
  FeatureToggleServiceComponent,
} from '@sourceloop/feature-toggle-service';
import * as dotenv from 'dotenv';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import path from 'path';
import {MySequence} from './sequence';
import { BearerVerifierBindings, BearerVerifierComponent, BearerVerifierConfig, BearerVerifierType, ServiceSequence } from '@sourceloop/core';
import { AuthenticationComponent } from 'loopback4-authentication';
dotenv.config();

export {ApplicationConfig};

export class FeatureToggleExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
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

    this.bind(FeatureToggleBindings.Config).to({
      bindControllers: true,
      useCustomSequence: true,
    });
    this.component(FeatureToggleServiceComponent);


    this.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.component(AuthenticationComponent);
    // Mount bearer verifier component
    this.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      useSymmetricEncryption: true,
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.component(BearerVerifierComponent);

    // Mount authorization component for default sequence

    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.component(AuthorizationComponent);

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
