// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  CoreBindings,
  ProviderMap,
  ServiceOrProviderClass,
  createBindingFromClass,
  inject,
} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {ExpressRequestHandler, RestApplication} from '@loopback/rest';
import {configure} from 'i18n';
import {cloneDeep} from 'lodash';

import {IncomingMessage, ServerResponse} from 'http';

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
import {TenantContextMiddlewareInterceptorProvider} from './middlewares';
import {TenantIdEncryptionProvider} from './providers/tenantid-encryption.provider';
import {DefaultUserModifyCrudService} from './services/default-user-modify-crud.service';
import {CoreConfig, addTenantId} from './types';

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
    this.providers = {};
    // Mount logger component
    this.application.component(LoggerExtensionComponent);

    this.application.component(Loopback4HelmetComponent);
    this.application.component(RateLimiterComponent);

    // Setup OBF
    const swaggerStatsMiddleware = this._setupSwaggerStats();
    if (swaggerStatsMiddleware) {
      middlewares.push(swaggerStatsMiddleware);
    }
    if (this.coreConfig?.tenantContextMiddleware) {
      this.application.middleware(TenantContextMiddlewareInterceptorProvider);
      this.providers[SFCoreBindings.TENANTID_ENCRYPTION_PROVIDER.key] =
        TenantIdEncryptionProvider;
    }

    if (this.coreConfig?.authenticateSwaggerUI) {
      this.application.component(SwaggerAuthenticationComponent);
    }
    // Configure locale provider
    if (this.coreConfig?.disablei18n) {
      // do nothing
    } else if (this.coreConfig?.configObject) {
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
        directory: process.env.LOCALE_PATH ?? `${__dirname}/../locales`,
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
    this.application
      .bind(SFCoreBindings.DEFAULT_USER_MODIFY_CRUD_SERVICE)
      .toClass(DefaultUserModifyCrudService);
  }

  private _setupSwaggerStats(): ExpressRequestHandler | undefined {
    if (!(this.coreConfig?.enableObf && this.coreConfig?.openapiSpec)) {
      return;
    }

    const sanitizedSpec = cloneDeep(this.coreConfig.openapiSpec) as {
      paths: AnyObject;
    };

    for (const path in sanitizedSpec.paths) {
      if (!this.coreConfig.modifyPathDefinition) {
        break;
      }
      const updatedDefinition = this.coreConfig.modifyPathDefinition(
        path,
        sanitizedSpec.paths[path],
      );
      if (updatedDefinition === null) {
        delete sanitizedSpec.paths[path];
        continue;
      }
      sanitizedSpec.paths[path] = updatedDefinition;
    }
    const middlewareConfig = Object.assign(
      this.coreConfig.swaggerStatsConfig ?? {},
      {
        name: this.coreConfig?.name,
        uriPath: this.coreConfig?.obfPath ?? `/obf`,
        swaggerSpec: sanitizedSpec,
        authentication: this.coreConfig.authentication ?? false,
      },
    );
    if (this.coreConfig?.tenantContextMiddleware) {
      middlewareConfig.onResponseFinish = (
        req: IncomingMessage,
        res: ServerResponse<IncomingMessage>,
        reqResponse: AnyObject,
      ) => {
        addTenantId(
          req,
          res,
          reqResponse,
          this.coreConfig?.tenantContextEncryptionKey,
        );
      };
    }
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
    return swStatsMiddleware;
  }

  localeObj: i18nAPI = {} as i18nAPI;

  providers?: ProviderMap = {};

  bindings: Binding[] = [];

  services?: ServiceOrProviderClass[];
}
