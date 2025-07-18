﻿// Copyright (c) 2023 Sourcefuse Technologies
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
import {AuthenticationServiceComponent} from '@sourceloop/authentication-service';
import {rateLimitKeyGen, SFCoreBindings} from '@sourceloop/core';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {
  AuthorizationBindings,
  UserPermissionsProvider,
} from 'loopback4-authorization';
import {HelmetSecurityBindings} from 'loopback4-helmet';
import {RateLimitSecurityBindings} from 'loopback4-ratelimiter';
import path from 'path';
import {RedisDataSource} from './datasources/redis.datasource';
import * as openapi from './openapi.json';
import {
  CasbinAuthorizationProvider,
  CasbinEnforcerConfigProvider,
  CasbinResValModifierProvider,
} from './providers';

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
    options.rest = options.rest ?? {};
    options.rest.port = +(process.env.PORT ?? port);
    options.rest.host = process.env.HOST;
    super(options);

    const enableObf = !!+(process.env.ENABLE_OBF ?? 1);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.bind(SFCoreBindings.config).to({
      openapiSpec: openapi,
      enableObf,
      obfPath: '/obf',
    });

    this.component(AuthenticationServiceComponent);

    this.bind(RateLimitSecurityBindings.CONFIG).to({
      name: 'redis',
      max: parseInt(process.env.RATE_LIMITER_MAX_REQS as string),
      windowMs: parseInt(process.env.RATE_LIMITER_WINDOW_MS as string),
      keyGenerator: rateLimitKeyGen,
    });
    this.bind(HelmetSecurityBindings.CONFIG).to({
      frameguard: {action: process.env.X_FRAME_OPTIONS},
    });
    this.bind('datasources.redis').to(RedisDataSource);

    this.bind(AuthorizationBindings.CASBIN_ENFORCER_CONFIG_GETTER).toProvider(
      CasbinEnforcerConfigProvider,
    );

    this.bind(AuthorizationBindings.CASBIN_RESOURCE_MODIFIER_FN).toProvider(
      CasbinResValModifierProvider,
    );
    this.bind(AuthorizationBindings.CASBIN_AUTHORIZE_ACTION).toProvider(
      CasbinAuthorizationProvider,
    );
    this.bind(AuthorizationBindings.USER_PERMISSIONS).toProvider(
      UserPermissionsProvider,
    );

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
