import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, Request} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {SecureSequence} from '@sourceloop/core';
import {
  AuthenticationServiceComponent,
  AuthServiceBindings,
} from '@sourceloop/authentication-service';
import {HelmetSecurityBindings} from 'loopback4-helmet';
import {RateLimitSecurityBindings} from 'loopback4-ratelimiter';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import path from 'path';
import {RedisDataSource} from './datasources/redis.datasource';

export {ApplicationConfig};

const port = 3000;
export class AuthMultitenantExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    if (process.env.NODE_ENV !== 'test') {
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
    options.rest = options.rest || {};
    options.rest.port = +(process.env.PORT ?? port);
    options.rest.host = process.env.HOST;
    super(options);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    this.component(AuthenticationServiceComponent);

    this.sequence(SecureSequence);

    this.bind(AuthServiceBindings.Config).to({useCustomSequence: true});
    this.bind(RateLimitSecurityBindings.CONFIG).to({
      name: 'redis',
      max: process.env.RATE_LIMITER_MAX_REQS,
      windowsMs: process.env.RATE_LIMITER_WINDOW_MS,
      keyGenerator: function (req: Request) {
        return req.ip;
      }
    });
    this.bind(HelmetSecurityBindings.CONFIG).to({
      frameguard: {action: process.env.X_FRAME_OPTIONS}
    });
    this.bind('datasources.redis').to(RedisDataSource);

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
