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
  }

  /**
   * The function `_setupSwaggerStats` sets up Swagger stats middleware based on configuration and
   * sanitized OpenAPI spec.
   * @returns The `_setupSwaggerStats` function returns an Express request handler or `undefined`.
   */
  private _setupSwaggerStats(): ExpressRequestHandler | undefined {
    if (!(this.coreConfig?.enableObf && this.coreConfig?.openapiSpec)) {
      return;
    }

    const sanitizedSpec = this._getSanitizedSpec();

    const middlewareConfig = this._buildMiddlewareConfig(sanitizedSpec);

    const swStatsMiddleware = swstats.getMiddleware({
      ...middlewareConfig,
      onAuthenticate: this._getSwaggerAuthHandler(),
    });

    return swStatsMiddleware;
  }

  /**
   * This function retrieves a sanitized OpenAPI specification by potentially modifying path definitions
   * based on a provided configuration.
   * @returns The `_getSanitizedSpec` method returns a sanitized OpenAPI specification object with
   * modified path definitions based on the `modifyPathDefinition` function provided in the
   * `coreConfig`. If the `modifyPathDefinition` function is not provided or returns `null` for a path,
   * that path is removed from the specification.
   */
  private _getSanitizedSpec(): {paths: AnyObject} {
    const spec = cloneDeep(this.coreConfig.openapiSpec) as {paths: AnyObject};

    if (!this.coreConfig.modifyPathDefinition) return spec;

    for (const path in spec.paths) {
      const updatedDefinition = this.coreConfig.modifyPathDefinition(
        path,
        spec.paths[path],
      );
      if (updatedDefinition === null) {
        delete spec.paths[path];
      } else {
        spec.paths[path] = updatedDefinition;
      }
    }

    return spec;
  }

  /**
   * The function `_buildMiddlewareConfig` constructs a configuration object for middleware based on
   * input specifications and core configuration settings.
   * @param sanitizedSpec - The `sanitizedSpec` parameter is an object that contains the `paths`
   * property. It is used to build a middleware configuration object in the `_buildMiddlewareConfig`
   * method. This method combines various configurations such as `name`, `uriPath`, `swaggerSpec`,
   * `authentication`, and `on
   * @returns The function `_buildMiddlewareConfig` is returning an object `config` that contains the
   * following properties:
   */
  private _buildMiddlewareConfig(sanitizedSpec: {paths: AnyObject}): AnyObject {
    const config = Object.assign(this.coreConfig.swaggerStatsConfig ?? {}, {
      name: this.coreConfig?.name,
      uriPath: this.coreConfig?.obfPath ?? `/obf`,
      swaggerSpec: sanitizedSpec,
      authentication: this.coreConfig.authentication ?? false,
    });

    if (this.coreConfig?.tenantContextMiddleware) {
      config.onResponseFinish = (
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

    return config;
  }

  /**
   * The function returns a handler function for Swagger authentication in TypeScript.
   * @returns A function is being returned that takes three parameters: `req`, `username`, and
   * `password`, and returns a boolean value. If `this.coreConfig.swaggerAuthenticate` is truthy, it
   * returns that value. Otherwise, it returns a function that checks if the `username` and `password`
   * match the values stored in `this.coreConfig.swaggerUsername` and `this.coreConfig.swaggerPassword`
   */
  private _getSwaggerAuthHandler(): (
    req: any,
    username: string,
    password: string,
  ) => boolean {
    return this.coreConfig.swaggerAuthenticate
      ? this.coreConfig.swaggerAuthenticate
      : (req, username, password) => {
          return (
            username === this.coreConfig.swaggerUsername &&
            password === this.coreConfig.swaggerPassword
          );
        };
  }

  localeObj: i18nAPI = {} as i18nAPI;

  providers?: ProviderMap = {};

  bindings: Binding[] = [];

  services?: ServiceOrProviderClass[];
}
