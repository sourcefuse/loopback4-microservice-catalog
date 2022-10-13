// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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
  PaymentServiceComponent,
  RazorpayBindings,
  StripeBindings,
} from '@sourceloop/payment-service';
import path from 'path';
import {MySequence} from './sequence';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';

export {ApplicationConfig};

export class PaymentExampleBackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    if (process?.env?.NODE_ENV && process.env.NODE_ENV !== 'test') {
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
    this.component(PaymentServiceComponent);
    this.bind(StripeBindings.Config).to({dataKey: '', publishKey: ''});
    this.bind(RazorpayBindings.RazorpayConfig).to({
      dataKey: '',
      publishKey: '',
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
