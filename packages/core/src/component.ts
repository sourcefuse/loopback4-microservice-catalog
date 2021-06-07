import {
  Binding,
  Component,
  ProviderMap,
  inject,
  CoreBindings,
} from '@loopback/core';
import {ExpressRequestHandler, RestApplication} from '@loopback/rest';
import {configure} from 'i18n';

import {LocaleKey} from './enums';
import {SFCoreBindings} from './keys';
import {LoggerExtensionComponent} from './components';
import {CoreConfig} from './types';
import {Loopback4HelmetComponent} from 'loopback4-helmet';
import {RateLimiterComponent} from 'loopback4-ratelimiter';
import * as swstats from 'swagger-stats';

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
      const swStatsMiddleware = swstats.getMiddleware({
        uriPath: this.coreConfig?.obfPath ?? `/obf`,
        swaggerSpec: this.coreConfig?.openapiSpec,
        authentication: this.coreConfig.authentication
          ? this.coreConfig.authentication
          : false,
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

    this.bindings.push(Binding.bind(SFCoreBindings.i18n).to(this.localeObj));
  }

  localeObj: i18nAPI = {} as i18nAPI;

  providers?: ProviderMap = {};

  bindings: Binding[] = [];
}
