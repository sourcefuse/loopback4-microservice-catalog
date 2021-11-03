import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {PaymentServiceComponent} from '@sourceloop/payment-service';
import {
  GatewayBindings,
  GatewayProvider,
  RazorpayBindings,
  RazorpayProvider,
  StripeBindings,
  StripeProvider,
} from '@sourceloop/payment-service/dist/providers';
import path from 'path';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class PaymentExampleBackendApplication extends BootMixin(
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
    this.component(PaymentServiceComponent);
    this.bind(StripeBindings.Config).to({dataKey: '', publishKey: ''});
    this.bind(StripeBindings.StripeHelper).toProvider(StripeProvider);
    this.bind(RazorpayBindings.RazorpayConfig).to({
      dataKey: '',
      publishKey: '',
    });
    this.bind(RazorpayBindings.RazorpayHelper).toProvider(RazorpayProvider);
    this.bind(GatewayBindings.GatewayHelper).toProvider(GatewayProvider);

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
