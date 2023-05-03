// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  CoreBindings,
  createBindingFromClass,
  inject,
  ProviderMap,
} from '@loopback/core';
import {ExpressRequestHandler, RestApplication} from '@loopback/rest';
import {configure} from 'i18n';
import {Loopback4HelmetComponent} from 'loopback4-helmet';
import {RateLimiterComponent} from 'loopback4-ratelimiter';
import * as swstats from 'swagger-stats';
import {
  LoggerExtensionComponent,
  SwaggerAuthenticationComponent,
} from './components';
import {OperationSpecEnhancer} from './enhancer/operation-spec-enhancer';
import {LocaleKey} from './enums';
import {OASBindings, SFCoreBindings} from './keys';
import {CoreConfig} from './types';

export class CoreComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(SFCoreBindings.config, {optional: true})
    private readonly coreConfig: CoreConfig,
    @inject(SFCoreBindings.EXPRESS_MIDDLEWARES, {optional: true})
    private readonly expressMiddlewares: ExpressRequestHandler[],
  ) {
    const middlewares = [];
    if (this.expressMiddlewares) {
      middlewares.push(...this.expressMiddlewares);
    }

    // Mount logger component
    this.application.component(LoggerExtensionComponent);

    this.application.component(Loopback4HelmetComponent);
    this.application.component(RateLimiterComponent);

    // Enable OBF
    if (this.coreConfig?.enableObf && this.coreConfig?.openapiSpec) {
      const middlewareConfig = Object.assign(
        this.coreConfig.swaggerStatsConfig ?? {},
        {
          name: this.coreConfig?.name,
          uriPath: this.coreConfig?.obfPath ?? `/obf`,
          swaggerSpec: this.coreConfig?.openapiSpec,
          authentication: this.coreConfig.authentication ?? false,
        },
      );
      const swStatsMiddleware = swstats.getMiddleware({
        ...middlewareConfig,
        onAuthenticate: this.coreConfig.swaggerAuthenticate
          ? this.coreConfig.swaggerAuthenticate
          : (req, username, password) => {
              return (
                username === this.coreConfig.swaggerUsername &&
                password === this.coreConfig.swaggerPassword
              );
            },
      });
      middlewares.push(swStatsMiddleware);
    }

    if (this.coreConfig?.authenticateSwaggerUI) {
      this.application.component(SwaggerAuthenticationComponent);
    }

    // Configure locale provider
    if (this.coreConfig?.configObject) {
      configure({...this.coreConfig.configObject, register: this.localeObj});
    } else {
      configure({
        locales: [
          LocaleKey.en,
          LocaleKey.es,
          LocaleKey.ptBr,
          LocaleKey.ptPt,
          LocaleKey.esCo,
        ],
        fallbacks: {
          [LocaleKey.es]: 'en',
          [LocaleKey.esCo]: 'en',
          [LocaleKey.ptBr]: 'en',
          [LocaleKey.ptPt]: 'en',
        },
        register: this.localeObj,
        directoryPermissions: '777',
        directory: `${__dirname}/../locales`,
        // sonarignore:start
        /* eslint-disable @typescript-eslint/no-explicit-any */
        objectNotation: '->' as any,
        // sonarignore:end
      });
    }

    this.application.bind(SFCoreBindings.EXPRESS_MIDDLEWARES).to(middlewares);
    this.bindings.push(Binding.bind(OASBindings.HiddenEndpoint).to([]));
    this.bindings.push(Binding.bind(SFCoreBindings.i18n).to(this.localeObj));
    this.application.add(createBindingFromClass(OperationSpecEnhancer));
  }

  localeObj: i18nAPI = {} as i18nAPI;

  providers?: ProviderMap = {};

  bindings: Binding[] = [];
}
