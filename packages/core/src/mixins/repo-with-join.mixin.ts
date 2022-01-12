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
import {BuilderConfig, ModelConstructor} from '..';

export function JoinMixin<
  M extends Entity,
  ID,
  Relations extends object,
  R extends MixinTarget<EntityCrudRepository<M, ID, Relations>>,
>(model: ModelConstructor<M>, superClass: R) {
  class MixedRepository extends superClass implements JoinedRepoMixin<M> {
    joinExecute: JoinExecutor;
    datasource: juggler.DataSource;
    findWithJoin = (
      filter?: Filter<M>,
      options?: AnyObject,
    ): Promise<AnyObject[]> => {
      if (filter?.include) {
        return this.joinExecute(filter, this.datasource, model, {
          schema: options?.schema,
          idType: options?.idType,
        });
      } else {
        return super.find(filter, options);
      }
    };
  }
  return MixedRepository;
}
