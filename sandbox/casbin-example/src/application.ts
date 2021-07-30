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
  AuthenticationServiceComponent,
  SignUpBindings,
} from '@sourceloop/authentication-service';
import {CasbinSecureSequence} from '@sourceloop/core';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import path from 'path';
import {
  CasbinEnforcerConfigProvider,
  CasbinResValModifierProvider,
} from './providers';
import {LocalSignupProvider} from './providers/local-signup.provider';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class CasbinExampleApplication extends BootMixin(
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
    this.component(AuthenticationServiceComponent);
    this.component(AuthorizationComponent);
    this.bind(SignUpBindings.LOCAL_SIGNUP_PROVIDER).toProvider(
      LocalSignupProvider,
    );

    // Bind Casbin Providers
    this.bind(AuthorizationBindings.CASBIN_ENFORCER_CONFIG_GETTER).toProvider(
      CasbinEnforcerConfigProvider,
    );

    this.bind(AuthorizationBindings.CASBIN_RESOURCE_MODIFIER_FN).toProvider(
      CasbinResValModifierProvider,
    );

    this.sequence(CasbinSecureSequence);

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
