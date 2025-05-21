// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Context, inject} from '@loopback/core';
import {
  AnyObject,
  Entity,
  Filter,
  HasManyDefinition,
  RelationType,
  WhereBuilder,
} from '@loopback/repository';
import {asRestResolver} from '../../constants';
import {
  IRestResolver,
  ModifiedRestService,
  ResolvedMap,
  RestLinkerParams,
  RestRelationConfig,
  RestResolverParams,
  isConfigWithKey,
  isConfigWithModelClass,
} from '../types';

@asRestResolver()
export class HasManyRestResolver<T extends Entity, S extends Entity>
  implements IRestResolver<T, S>
{
  constructor(
    @inject.context()
    private readonly context: Context,
  ) {}
  type: RelationType = RelationType.hasMany;
  async resolve({
    relationConfig,
    relationMetadata,
    results,
    scope,
    token,
  }: RestResolverParams<T, S> & {
    relationMetadata: HasManyDefinition;
  }): Promise<ResolvedMap<T, S>> {
    if (relationMetadata.through) {
      return this._resolveHasManyThrough({
        relationConfig,
        relationMetadata,
        results,
        scope,
        token,
      });
    } else {
      return this._resolveHasManyOnly({
        relationConfig,
        relationMetadata,
        results,
        scope,
        token,
      });
    }
  }

  /**
   * The function `_resolveHasManyThrough` handles resolving a has-many-through relation in TypeScript,
   * extracting necessary data and mapping related results.
   * @param  - The `_resolveHasManyThrough` function is responsible for resolving a has-many-through
   * relationship in a REST API resolver. Here is an explanation of the parameters used in the
   * function:
   * @returns The `_resolveHasManyThrough` method returns the mapped related results based on the
   * provided parameters and configurations.
   */
  private async _resolveHasManyThrough({
    relationConfig,
    relationMetadata,
    results,
    scope,
    token,
  }: RestResolverParams<T, S> & {
    relationMetadata: HasManyDefinition;
  }) {
    if (!relationMetadata.through) {
      throw new Error('Through relation was expected');
    }
    if (!relationConfig.throughRelation) {
      throw new Error('Through relation was expected in proxy config');
    }
    const relatedService = await this.getService(relationConfig);
    const {keyFromThrough, keyToThrough, keyTo} =
      this._getThroughKeys(relationMetadata);

    const throughModelProperty = relationConfig.throughRelation as keyof T;
    const {idsSet, throughMap} = await this._extractThroughData(
      results,
      throughModelProperty,
      keyToThrough,
      keyFromThrough,
    );

    const filter = await this.addConditionToScope(
      Array.from(idsSet),
      keyTo as string,
      scope,
    );
    const relatedResults = await this.findRelatedData(
      relatedService,
      filter,
      token,
      relationConfig,
    );
    return this._mapRelatedResults(
      relatedResults,
      throughMap,
      keyTo,
      relationMetadata,
    );
  }

  /**
   * The function `_getThroughKeys` retrieves key information for a HasMany relation, including keys
   * from a through model if specified.
   * @param {HasManyDefinition} relationMetadata - The `relationMetadata` parameter is of type
   * `HasManyDefinition`, which likely contains metadata information about a has-many relationship in a
   * data model. It may include details such as the source and target models, keys used for the
   * relationship, and possibly a through model for a many-to-many relationship.
   * @returns The function `_getThroughKeys` returns an object with three properties: `keyFromThrough`,
   * `keyToThrough`, and `keyTo`.
   */
  private _getThroughKeys(relationMetadata: HasManyDefinition) {
    const keyFromThrough =
      relationMetadata.through?.keyFrom ??
      `${this.toPascalCase(relationMetadata.source.name)}Id`;

    const keyToThrough =
      relationMetadata.through?.keyTo ??
      `${this.toPascalCase(relationMetadata.target.name)}Id`;

    const keyTo = (relationMetadata.keyTo ?? 'id') as keyof S;

    return {keyFromThrough, keyToThrough, keyTo};
  }

  /**
   * The function `_extractThroughData` extracts data from an array of objects based on specified
   * properties and returns a set of IDs and a map of key-value pairs.
   * @param {T[]} results - The `results` parameter is an array of objects of type `T`.
   * @param throughModelProperty - The `throughModelProperty` parameter is the property of the object
   * `T` that contains the through data.
   * @param {string} keyToThrough - The `keyToThrough` parameter in the `_extractThroughData` function
   * represents the key in the through data object that is used as the identifier for mapping purposes.
   * It is the key that is used to uniquely identify each item in the through data.
   * @param {string} keyFromThrough - The `keyFromThrough` parameter in the `_extractThroughData`
   * function represents the key in the through data object that you want to extract values from and
   * store in the `throughMap`. This key is used as the value in the map where the key is the
   * `keyToThrough` value.
   * @returns The function `_extractThroughData` returns an object with two properties: `idsSet`, which
   * is a Set containing unique values extracted from the `keyToThrough` property of the through data,
   * and `throughMap`, which is a Map where the key is extracted from the `keyToThrough` property and
   * the value is extracted from the `keyFromThrough` property of the through data.
   */
  private async _extractThroughData(
    results: T[],
    throughModelProperty: keyof T,
    keyToThrough: string,
    keyFromThrough: string,
  ) {
    const idsSet = new Set<T[keyof T]>();
    const throughMap = new Map<S[keyof S], S[keyof S]>();

    for (const result of results) {
      const throughData = result[throughModelProperty] as
        | AnyObject[]
        | undefined;
      if (throughData) {
        throughData.forEach(d => {
          idsSet.add(d[keyToThrough]);
          throughMap.set(d[keyToThrough], d[keyFromThrough]);
        });
      }
    }

    return {idsSet, throughMap};
  }

  /**
   * The function `_mapRelatedResults` creates a map of related results based on a specified key and
   * relation metadata.
   * @param {S[]} relatedResults - The `relatedResults` parameter is an array of elements of type `S`,
   * which represents the related results that need to be mapped.
   * @param throughMap - The `throughMap` parameter is a Map that maps a key from one type `S` to another
   * key of type `S`. It is used to retrieve a key from the `relatedResults` based on the `keyTo`
   * property of type `S`.
   * @param keyTo - The `keyTo` parameter in the `_mapRelatedResults` function is a property key of the
   * type `S`. It is used to access a specific property of the items in the `relatedResults` array.
   * @param {HasManyDefinition} relationMetadata - The `relationMetadata` parameter in the
   * `_mapRelatedResults` function is of type `HasManyDefinition`. It likely contains metadata
   * information related to a has-many relationship in the context of the function's operation. This
   * metadata could include details such as the through model, model names, and other relevant
   * information
   * @returns The function `_mapRelatedResults` is returning a `Map` object that maps keys of type
   * `S[keyof S] | T[keyof T]` to arrays of type `S[]`.
   */
  private _mapRelatedResults(
    relatedResults: S[],
    throughMap: Map<S[keyof S], S[keyof S]>,
    keyTo: keyof S,
    relationMetadata: HasManyDefinition,
  ) {
    const relatedRecordMap = new Map<S[keyof S] | T[keyof T], S[]>();

    for (const item of relatedResults) {
      const keyFrom = throughMap.get(item[keyTo]);
      if (!keyFrom) {
        throw new Error(
          `No key found for ${item[keyTo]} in through model ${relationMetadata.through?.model.name}`,
        );
      }
      if (!relatedRecordMap.has(keyFrom)) {
        relatedRecordMap.set(keyFrom, [item]);
      } else {
        relatedRecordMap.get(keyFrom)?.push(item);
      }
    }

    return relatedRecordMap;
  }

  private async _resolveHasManyOnly({
    relationConfig,
    relationMetadata,
    results,
    scope,
    token,
  }: RestResolverParams<T, S> & {
    relationMetadata: HasManyDefinition;
  }) {
    const relatedService = await this.getService(relationConfig);
    const keyFrom = (relationMetadata.keyFrom ??
      relationMetadata.source.getIdProperties()[0]) as keyof T;
    const keyTo = (relationMetadata.keyTo ??
      `${this.toPascalCase(relationMetadata.source.name)}Id`) as keyof S;
    const filter = await this.addConditionToScope(
      results.map(r => r[keyFrom]),
      keyTo as string,
      scope,
    );
    const relatedResults = await this.findRelatedData(
      relatedService,
      filter,
      token,
      relationConfig,
    );
    const relatedRecordMap = new Map<S[keyof S] | T[keyof T], S[]>();
    for (const item of relatedResults) {
      const key = item[keyTo];
      if (!relatedRecordMap.has(key)) {
        relatedRecordMap.set(key, [item]);
      } else {
        relatedRecordMap.get(key)?.push(item);
      }
    }
    return relatedRecordMap;
  }

  async link(
    params: RestLinkerParams<T, S> & {
      relationMetadata: HasManyDefinition;
    },
  ): Promise<T> {
    const keyFrom = (params.relationMetadata.keyFrom ??
      params.relationMetadata.source.getIdProperties()[0]) as keyof T;
    const relationName = params.relationMetadata.name as keyof T;
    params.parent[relationName] = params.resolvedDataMap.get(
      params.parent[keyFrom],
    ) as T[keyof T];
    return params.parent;
  }

  private async addConditionToScope(
    ids: T[keyof T][],
    field: string,
    scope?: Filter<S>,
  ) {
    const condition = {
      [field]: {
        inq: ids.filter(id => id), //filter out valid IDs
      },
    };
    const whereBuilder = new WhereBuilder();
    whereBuilder.and([condition, scope?.where].filter(w => !!w));
    return {
      ...scope,
      where: whereBuilder.build(),
    };
  }

  private findRelatedData(
    service: ModifiedRestService<S>,
    filter: Filter<S>,
    token?: string,
    config?: RestRelationConfig,
  ) {
    return service.find(filter, token, config);
  }

  private toPascalCase(str: string) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  private async getService(config: RestRelationConfig) {
    if (isConfigWithKey(config)) {
      return this.context.get<ModifiedRestService<S>>(config.serviceKey);
    } else if (isConfigWithModelClass(config)) {
      return this.context.get<ModifiedRestService<S>>(
        `services.${config.modelClass.name}Proxy`,
      );
    } else {
      return this.context.get<ModifiedRestService<S>>(
        `services.${config.serviceClass.name}`,
      );
    }
  }
}
