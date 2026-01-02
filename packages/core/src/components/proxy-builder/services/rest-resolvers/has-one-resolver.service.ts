// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Context, inject} from '@loopback/core';
import {
  Entity,
  Filter,
  HasOneDefinition,
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
export class HasOneRestResolver<
  Source extends Entity,
  Target extends Entity,
> implements IRestResolver<Source, Target> {
  type: RelationType = RelationType.hasOne;
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
  }: RestResolverParams<Source, Target> & {
    relationMetadata: HasOneDefinition;
  }) {
    const relatedService = await this.getService(relationConfig);
    const keyFrom = this.getKeyFrom(relationMetadata);
    const keyTo = (relationMetadata.keyTo ??
      this.toPascalCase(relationMetadata.source.name) + 'Id') as keyof Target;
    const filter = await this.addConditionToScope(
      keyTo,
      results.map(r => r[keyFrom]),
      scope,
    );
    const relatedResults = await this.findRelatedData(
      relatedService,
      filter,
      token,
      relationConfig,
    );
    const relatedRecordMap = new Map<
      Target[keyof Target] | Source[keyof Source],
      Target
    >();
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
  }: RestLinkerParams<Source, Target> & {
    relationMetadata: HasOneDefinition;
  }) {
    const keyFrom = this.getKeyFrom(relationMetadata);
    const relationName = relationMetadata.name as keyof Source;
    parent[relationName] = resolvedDataMap.get(
      parent[keyFrom],
    ) as Source[keyof Source];
    return parent;
  }

  private async addConditionToScope(
    keyTo: keyof Target,
    ids: Source[keyof Source][],
    scope?: Filter<Target>,
  ) {
    const condition = {
      [keyTo]: {
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
    service: ModifiedRestService<Target>,
    filter: Filter<Target>,
    token?: string,
    config?: RestRelationConfig,
  ) {
    return service.find(filter, token, config);
  }

  private getKeyFrom(relationMetadata: HasOneDefinition) {
    const sourceIdProp = relationMetadata.source.getIdProperties()?.[0];
    if (!sourceIdProp) {
      throw new Error('Source model does not have an id property');
    }
    const keyFrom = (relationMetadata.keyFrom ?? sourceIdProp) as keyof Source;
    return keyFrom;
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
      return this.context.get<ModifiedRestService<Target>>(config.serviceKey);
    } else if (isConfigWithModelClass(config)) {
      return this.context.get<ModifiedRestService<Target>>(
        `services.${config.modelClass.name}Proxy`,
      );
    } else {
      return this.context.get<ModifiedRestService<Target>>(
        `services.${config.serviceClass.name}`,
      );
    }
  }
}
