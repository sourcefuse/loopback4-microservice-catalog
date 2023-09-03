// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  BindingScope,
  extensionPoint,
  extensions,
  Getter,
  inject,
  Provider,
} from '@loopback/core';
import {
  AnyObject,
  DataObject,
  Entity,
  Filter,
  FilterExcludingWhere,
  InclusionFilter,
  Where,
} from '@loopback/repository';
import {HttpErrors, Request, RestBindings} from '@loopback/rest';

import {ServiceBuilderExtensionPoint} from '../keys';
import {
  CrudRestService,
  CrudRestServiceModifier,
  IRestResolver,
  ModelConstructor,
  ResolverWithMetadata,
  RestRelationConfig,
} from '../services';

@extensionPoint(ServiceBuilderExtensionPoint.key, {
  scope: BindingScope.REQUEST,
})
export class RestServiceModifier<T extends Entity, S extends Entity>
  implements Provider<CrudRestServiceModifier<T>>
{
  private token: string;
  private resolvers: IRestResolver<T, S>[];
  constructor(
    @extensions()
    private resolverGetter: Getter<IRestResolver<T, S>[]>,
    @inject(RestBindings.Http.REQUEST, {optional: true}) private req?: Request,
  ) {
    if (req?.headers.authorization) {
      this.token = req.headers.authorization;
    }
  }
  async value() {
    this.resolvers = await this.resolverGetter();
    return (
      service: CrudRestService<T>,
      model: ModelConstructor<T>,
      config: RestRelationConfig[],
    ) => {
      return {
        ...service,
        create: this.create.bind(this, service),
        findById: this.findById.bind(this, service, model, config),
        find: this.find.bind(this, service, model, config),
        count: this.count.bind(this, service),
        updateById: this.updateById.bind(this, service),
        deleteById: this.deleteById.bind(this, service),
        update: this.update.bind(this, service),
        replaceById: this.replaceById.bind(this, service),
        delete: this.delete.bind(this, service),
      };
    };
  }

  create(service: CrudRestService<T>, data: DataObject<T>, token?: string) {
    return service.create(this._validateToken(token), data);
  }
  async findById(
    service: CrudRestService<T>,
    model: ModelConstructor<T>,
    config: RestRelationConfig[],
    id: string,
    filter?: FilterExcludingWhere<T>,
    token?: string,
  ) {
    const {restRelations, scopeMap} = this._relationsFromFilter(config, filter);
    const result = await service.findById(
      this._validateToken(token),
      id,
      JSON.stringify(filter),
    );
    const resolvedResults = await this._resolveRelations(
      restRelations,
      scopeMap,
      model,
      [result],
      token,
    );
    return resolvedResults[0];
  }

  async find(
    service: CrudRestService<T>,
    model: ModelConstructor<T>,
    config: RestRelationConfig[],
    filter?: Filter<T>,
    token?: string,
    inclusionConfig?: RestRelationConfig,
  ) {
    const {restRelations, scopeMap} = this._relationsFromFilter(config, filter);
    const passedFilter = inclusionConfig?.disableStringify
      ? filter
      : JSON.stringify(filter);
    const results = await service.find(
      this._validateToken(token),
      passedFilter,
    );
    return this._resolveRelations(
      restRelations,
      scopeMap,
      model,
      results,
      token,
    );
  }

  count(service: CrudRestService<T>, where?: Where<T>, token?: string) {
    return service.count(this._validateToken(token), JSON.stringify(where));
  }
  updateById(
    service: CrudRestService<T>,
    id: string,
    data: DataObject<T>,
    token?: string,
  ) {
    return service.updateById(this._validateToken(token), id, data);
  }
  deleteById(service: CrudRestService<T>, id: string, token?: string) {
    return service.deleteById(this._validateToken(token), id);
  }
  delete(service: CrudRestService<T>, where?: Where<T>, token?: string) {
    return service.delete(this._validateToken(token), where);
  }
  update(
    service: CrudRestService<T>,
    data: DataObject<T>,
    where?: Where<T>,
    token?: string,
  ) {
    return service.update(
      this._validateToken(token),
      data,
      JSON.stringify(where),
    );
  }
  replaceById(
    service: CrudRestService<T>,
    id: string,
    data: DataObject<T>,
    token?: string,
  ) {
    return service.replaceById(this._validateToken(token), id, data);
  }

  private _validateToken(token?: string) {
    if (!token && !this.token) {
      throw new HttpErrors.Unauthorized('No token provided');
    }
    return token ?? this.token;
  }

  /**
   * It takes a filter and a list of relations, and returns a list of relations that are REST relations,
   * and a map of scopes for those relations
   * @param {RestRelationConfig[]} configs - RestRelationConfig[]
   * @param [filter] - The filter object that was passed to the find method.
   * @returns An object with two properties: restRelations and scopeMap.
   */
  private _relationsFromFilter(
    configs: RestRelationConfig[],
    filter?: Filter<T>,
  ) {
    if (filter?.include) {
      const restRelations: RestRelationConfig[] = [];
      const normalRelations: InclusionFilter[] = [];
      const scopeMap = new Map<string, Filter<S>>();
      filter.include.forEach(relation => {
        let name: string;
        if (typeof relation === 'string') {
          name = relation;
        } else {
          name = relation.relation;
        }
        const relationConfig = configs.find(config => config.name === name);
        if (relationConfig) {
          restRelations.push(relationConfig);
          if (typeof relation !== 'string' && relation.scope) {
            scopeMap.set(relationConfig.name, relation.scope as Filter<S>);
          }
        } else {
          normalRelations.push(relation);
        }
      });
      const extraIncludes = this._extraFilters(restRelations);
      this._updateFilter(extraIncludes, filter, normalRelations);
      return {restRelations, scopeMap};
    }
    return {restRelations: [], scopeMap: new Map()};
  }

  private _updateFilter(
    extraIncludes: InclusionFilter[],
    filter: Filter<T>,
    normalRelations: InclusionFilter[],
  ) {
    if (extraIncludes.length) {
      normalRelations.push(...extraIncludes);
    }
    filter.include = normalRelations;
    if (filter.include.length === 0) {
      delete filter.include;
    }
  }

  private _extraFilters(configs: RestRelationConfig[]) {
    const extraIncludes: InclusionFilter[] = [];
    configs.forEach(config => {
      if (config.throughRelation) {
        extraIncludes.push({
          relation: config.throughRelation,
        });
      }
    });
    return extraIncludes;
  }

  /**
   * It takes a list of relations, a list of results, and a token, and returns a list of results with the
   * relations resolved
   * @param {RestRelationConfig[]} relations - RestRelationConfig[]
   * @param scopeMap - Map<string, Filter<S>>
   * @param model - The model class that we are querying
   * @param {T[]} results - The results of the query.
   * @param {string} token - The access token of the current user.
   */
  private async _resolveRelations(
    relations: RestRelationConfig[],
    scopeMap: Map<string, Filter<S>>,
    model: ModelConstructor<T>,
    results: T[],
    token?: string,
  ) {
    const resolvePromises = [];
    const indexedData: ResolverWithMetadata<T, S>[] = [];
    for (const relationConfig of relations) {
      const relationMetadata = model.definition.relations[relationConfig.name];
      if (!relationMetadata) {
        throw HttpErrors.BadRequest(
          `No metadata with name: ${relationConfig.name}`,
        );
      }
      const resolver = this.resolvers.find(
        r => r.type === relationMetadata.type,
      );
      if (resolver) {
        resolvePromises.push(
          resolver.resolve({
            relationConfig,
            relationMetadata,
            results,
            scope: scopeMap.get(relationConfig.name),
            token,
          }),
        );
        indexedData.push({
          metadata: relationMetadata,
          resolver,
        });
      } else {
        throw HttpErrors.BadRequest(
          `No Resolver registered for relation type: ${relationMetadata.type}`,
        );
      }
    }
    const resolvedData = await Promise.all(resolvePromises);
    const linkPromises: Promise<T>[] = [];
    results.forEach(result => {
      const relatedData: AnyObject = {};
      indexedData.forEach(({metadata, resolver}, index) => {
        linkPromises.push(
          resolver.link({
            parent: result,
            relationMetadata: metadata,
            resolvedDataMap: resolvedData[index],
            token,
          }),
        );
      });
      return relatedData;
    });
    await Promise.all(linkPromises);
    return results;
  }

  private _configsHaveRelations(configs: RestRelationConfig[], name: string) {
    return configs.some(config => config.name === name);
  }
}
