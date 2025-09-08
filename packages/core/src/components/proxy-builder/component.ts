// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Application,
  Binding,
  Component,
  CoreBindings,
  createBindingFromClass,
  inject,
  injectable,
} from '@loopback/core';
import {AnyObject, Entity, juggler} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {getService} from '@loopback/service-proxy';
import {CONTENT_TYPE} from '../../constants';
import {restProxyBuilder} from './constants';
import {ProxyBuilderBindings} from './keys';
import {
  BelongsToRestResolver,
  CrudRestService,
  CrudRestServiceModifier,
  HasManyRestResolver,
  HasOneRestResolver,
  ModelConstructor,
  ModifiedRestService,
  RestRelationConfig,
  RestServiceModifier,
} from './services';
import {
  EntityRestConfig,
  isEntityRestConfig,
  ProxyBuilderConfig,
  RestOperationTemplate,
} from './types';

@injectable()
export class ProxyBuilderComponent implements Component {
  bindings?: Binding<AnyObject>[];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: Application,
    @inject(ProxyBuilderBindings.CONFIG)
    private readonly options: ProxyBuilderConfig,
  ) {
    this.bindings = [
      createBindingFromClass(RestServiceModifier, {
        key: ProxyBuilderBindings.PROXY_MODIFIER,
      }),
      createBindingFromClass(BelongsToRestResolver),
      createBindingFromClass(HasManyRestResolver),
      createBindingFromClass(HasOneRestResolver),
      Binding.bind(ProxyBuilderBindings.TOKEN_VALIDATOR).to(
        (context: AnyObject, token?: string) => {
          if (!token && !context.token) {
            throw new HttpErrors.Unauthorized('No token provided');
          }
          return token ?? context.token;
        },
      ),
    ];
    if (options.length) {
      options.forEach(config => {
        config.configs.forEach(modelConfig => {
          const processConfig = this._handleConfig(modelConfig);
          const basePath = this._createBasePath(processConfig.model);
          this._bindDataSource(
            processConfig.model,
            processConfig.basePath ?? basePath,
            processConfig.restOperations,
            config.baseUrl,
          );
          this._bindService(processConfig.model, processConfig.relations);
        });
      });
    }
  }

  private _handleConfig(config: EntityRestConfig | ModelConstructor<Entity>) {
    if (isEntityRestConfig(config)) {
      return config;
    } else {
      return {
        model: config,
      };
    }
  }

  private _bindDataSource(
    model: ModelConstructor<Entity>,
    basePath: string,
    restOperations?: RestOperationTemplate[],
    baseUrl?: string,
  ) {
    if (baseUrl === undefined) {
      throw new Error('Base url is required');
    }
    this.application.bind(`datasources.${model.name}ProxyDataSource`).to(
      new juggler.DataSource({
        name: `${model.name}Proxy`,
        connector: 'rest',
        baseURL: '',
        crud: false,
        options: {
          baseUrl: baseUrl,
          headers: {
            accept: CONTENT_TYPE.JSON,
            ['content-type']: CONTENT_TYPE.JSON,
          },
        },
        operations: [...restProxyBuilder(basePath), ...(restOperations ?? [])],
      }),
    );
  }

  private _bindService(
    model: ModelConstructor<Entity>,
    restRelations?: RestRelationConfig[],
  ) {
    class TempClass {
      public dataSource: juggler.DataSource;
      public serviceModifier: CrudRestServiceModifier<Entity>;

      async value(): Promise<ModifiedRestService<Entity>> {
        const service = await getService<CrudRestService<Entity>>(
          this.dataSource,
        );
        return this.serviceModifier(service, model, restRelations ?? []);
      }
    }
    inject(`datasources.${model.name}ProxyDataSource`)(
      TempClass.prototype,
      'dataSource',
    );
    inject(ProxyBuilderBindings.PROXY_MODIFIER)(
      TempClass.prototype,
      'serviceModifier',
    );
    this.application.bind(`services.${model.name}Proxy`).toProvider(TempClass);
  }

  private _createBasePath(model: ModelConstructor<Entity>) {
    const basePath = model.definition.settings?.rest?.basePath;
    if (basePath) {
      return basePath;
    }
    return `/${model.modelName?.toLowerCase()}`;
  }
}
