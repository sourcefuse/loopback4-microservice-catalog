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
  OidcServiceComponent,
  OIDCServiceBindings,
} from '@sourceloop/oidc-service';
import path from 'path';
import {MySequence} from './sequence';
import {CustomFindAccountProvider} from './providers';

export {ApplicationConfig};

export class OidcApplication extends BootMixin(
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

    // add oidc component
    this.component(OidcServiceComponent);

    // Modify the claims
    this.bind(OIDCServiceBindings.FIND_ACCOUNT_PROVIDER).toProvider(
      CustomFindAccountProvider,
    );

    // Modify the template file paths
    this.bind(OIDCServiceBindings.LoginTemplate).to(
      path.join(__dirname, '../public/views/login.ejs'),
    );
    this.bind(OIDCServiceBindings.InteractionTemplate).to(
      path.join(__dirname, '../public/views/interaction.ejs'),
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
