// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Context, inject} from '@loopback/core';
import {
  BelongsToDefinition,
  Entity,
  Filter,
  RelationType,
  WhereBuilder,
} from '@loopback/repository';
import {asRestResolver} from '../../constants';
import {
  IRestResolver,
  ModifiedRestService,
  RestLinkerParams,
  RestRelationConfig,
  RestResolverParams,
  isConfigWithKey,
  isConfigWithModelClass,
} from '../types';

@asRestResolver()
export class BelongsToRestResolver<T extends Entity, S extends Entity>
  implements IRestResolver<T, S>
{
  type: RelationType = RelationType.belongsTo;
  constructor(
    @inject.context()
    private readonly context: Context,
  ) {}
  /**
   * It takes the results of the query, finds the foreign key in each result, and then uses that key to
   * find the related record in the related service
   * @param  - `relationConfig` is the configuration object for the relation.
   * @returns A map of related records.
   */
  async resolve({
    relationConfig,
    relationMetadata,
    results,
    scope,
    token,
  }: RestResolverParams<T, S> & {
    relationMetadata: BelongsToDefinition;
  }) {
    const relatedService = await this.getService(relationConfig);
    const keyFrom = (relationMetadata.keyFrom ??
      this.toPascalCase(relationMetadata.source.name) + 'Id') as keyof T;
    const keyTo = (relationMetadata.keyTo ?? 'id') as keyof S;
    const filter = await this.addConditionToScope(
      results.map(r => r[keyFrom]),
      scope,
    );
    const relatedResults = await relatedService.find(
      filter ?? {},
      token,
      relationConfig,
    );
    const relatedRecordMap = new Map<S[keyof S] | T[keyof T], S>();
    for (const item of relatedResults) {
      const key = item[keyTo];
      if (!relatedRecordMap.has(key)) {
        relatedRecordMap.set(key, item);
      }
    }
    return relatedRecordMap;
  }

  /**
   * It takes a parent object, looks up the foreign key on the parent, and then uses that foreign key to
   * look up and link the related object in the resolvedDataMap
   * @param  - `relationMetadata` is the metadata for the relation being linked.
   * @returns The parent object with the relationName property set to the
   * resolvedDataMap.get(parent[keyFrom])
   */
  async link({
    relationMetadata,
    parent,
    resolvedDataMap,
    token,
  }: RestLinkerParams<T, S> & {
    relationMetadata: BelongsToDefinition;
  }) {
    const keyFrom = (relationMetadata.keyFrom ??
      this.toPascalCase(relationMetadata.source.name) + 'Id') as keyof T;
    const relationName = relationMetadata.name as keyof T;
    parent[relationName] = resolvedDataMap.get(parent[keyFrom]) as T[keyof T];
    return parent;
  }

  private async addConditionToScope(ids: T[keyof T][], scope?: Filter<S>) {
    const condition = {
      id: {
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
