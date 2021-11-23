import {Filter} from '@loopback/filter';
import {Entity, juggler} from '@loopback/repository';
import {AnyObject} from 'loopback-datasource-juggler';
import {JoinExecutor, ModelConstructor} from '..';

export interface JoinedRepoMixin<M extends Entity> {
  joinExecute: JoinExecutor;
  datasource: juggler.DataSource;
  findWithJoin<S extends RelationMap, T extends S[keyof S]>(
    filter?: FilterWithJoin<M, S, T>,
    options?: AnyObject,
  ): Promise<AnyObject[]>;
}

export type FilterWithJoin<
  T extends Entity,
  S extends RelationMap,
  R extends S[keyof S],
> = Filter<T> & {
  join: RelationType<R>[];
};

export type RelationType<R extends Entity> = {
  model: ModelConstructor<R>;
  filter?: Exclude<
    Filter<R>,
    'order' | 'limit' | 'skip' | 'offset' | 'include'
  >;
  // aggregate?: boolean; TBD
};

export type RelationMap = {
  [s: string]: Entity;
};
