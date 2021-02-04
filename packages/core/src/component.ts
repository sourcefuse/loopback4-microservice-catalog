import {
  Binding,
  Component,
  ProviderMap,
  inject,
  CoreBindings,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
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
  ) {
    // Mount logger component
    this.application.component(LoggerExtensionComponent);

    this.application.component(Loopback4HelmetComponent);
    this.application.component(RateLimiterComponent);

    // Enable OBF
    if (this.coreConfig?.enableObf && this.coreConfig?.openapiSpec) {
      this.application.expressMiddleware(
        'swStats',
        swstats.getMiddleware({
          uriPath: this.coreConfig?.obfPath ?? `/obf`,
          swaggerSpec: this.coreConfig?.openapiSpec,
        }),
      );
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

    this.bindings.push(Binding.bind(SFCoreBindings.i18n).to(this.localeObj));
  }

  localeObj: i18nAPI = {} as i18nAPI;

  providers?: ProviderMap = {};

  bindings: Binding[] = [];
}
