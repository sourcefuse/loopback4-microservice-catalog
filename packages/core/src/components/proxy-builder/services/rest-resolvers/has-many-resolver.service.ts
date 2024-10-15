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
    const keyFromThrough =
      relationMetadata.through.keyFrom ??
      `${this.toPascalCase(relationMetadata.source.name)}Id`;
    const keyToThrough =
      relationMetadata.through.keyTo ??
      `${this.toPascalCase(relationMetadata.target.name)}Id`;
    const keyTo = (relationMetadata.keyTo ?? 'id') as keyof S;
    const throughModelProperty = relationConfig.throughRelation as keyof T;
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
    const relatedRecordMap = new Map<S[keyof S] | T[keyof T], S[]>();
    for (const item of relatedResults) {
      const keyFrom = throughMap.get(item[keyTo]);
      if (!keyFrom) {
        throw new Error(
          `No key found for ${item[keyTo]} in through model ${relationMetadata.through.model.name}`,
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
