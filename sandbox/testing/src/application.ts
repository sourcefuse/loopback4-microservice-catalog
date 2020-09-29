import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent
} from 'loopback4-authorization';
import path from 'path';
import {VideoChatBindings, VideoConfServiceComponent, VonageBindings} from '../../../services/video-conferencing-service/dist';
import {CasbinEnforcerConfigProvider} from './providers/casbin-enforcer-config.provider';
import {CasbinResValModifierProvider} from './providers/casbin-resource-val-modifier.provider';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class TestingApplication extends BootMixin(
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

    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });

    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    this.bind(VonageBindings.config).to({
      apiKey: `${process.env.VONAGE_API_KEY}`,
      apiSecret: `${process.env.VONAGE_API_SECRET}`,
      timeToStart: 10,
    });

    this.bind(VideoChatBindings.Config).to({
      useCustomSequence: true,
    });

    this.component(VideoConfServiceComponent);

    this.bind(AuthorizationBindings.CASBIN_ENFORCER_CONFIG_GETTER).toProvider(
      CasbinEnforcerConfigProvider,
    );

    this.bind(AuthorizationBindings.CASBIN_RESOURCE_MODIFIER_FN).toProvider(
      CasbinResValModifierProvider,
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
