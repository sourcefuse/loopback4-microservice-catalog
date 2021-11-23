import {MixinTarget} from '@loopback/core';
import {
  Entity,
  EntityCrudRepository,
  Fields,
  Filter,
  juggler,
  Where,
} from '@loopback/repository';
import {AnyObject} from 'loopback-datasource-juggler';
import {FilterWithJoin, JoinedRepoMixin, RelationMap} from './types';
import {JoinExecutor} from '../providers/types';
import {ModelConstructor} from '..';

export function JoinMixin<
  M extends Entity,
  ID,
  Relations extends object,
  R extends MixinTarget<EntityCrudRepository<M, ID, Relations>>,
>(model: ModelConstructor<M>, superClass: R) {
  const getFilter = <S extends RelationMap, T extends S[keyof S]>(
    filter?: FilterWithJoin<M, S, T>,
  ): Filter<M> => {
    return {
      where: filter?.where as Where<M>,
      order: filter?.order,
      limit: filter?.limit,
      skip: filter?.skip,
      offset: filter?.offset,
      fields: filter?.fields as Fields<M>,
      include: filter?.include,
    };
  };
  class MixedRepository extends superClass implements JoinedRepoMixin<M> {
    joinExecute: JoinExecutor;
    datasource: juggler.DataSource;
    findWithJoin = <S extends RelationMap, T extends S[keyof S]>(
      filter?: FilterWithJoin<M, S, T>,
      options?: AnyObject,
    ): Promise<AnyObject[]> => {
      if (filter?.join) {
        const relations = this.entityClass.definition.relations;
        return this.joinExecute(
          filter,
          this.datasource,
          model,
          relations,
          options?.idType,
        );
      } else {
        const filterWithoutJoin = getFilter(filter);
        return super.find(filterWithoutJoin, options);
      }
    };
  }
  return MixedRepository;
}
