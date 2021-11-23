import {Entity, juggler} from '@loopback/repository';
import {AnyObject} from 'loopback-datasource-juggler';
import {ModelConstructor} from '..';
import {FilterWithJoin, RelationMap} from '../mixins/types';
export type JoinExecutor = <
  T extends Entity,
  S extends RelationMap,
  R extends S[keyof S],
>(
  filter: FilterWithJoin<T, S, R>,
  datasource: juggler.DataSource,
  model: ModelConstructor<T>,
  relations: RelationsMap,
  idType?: string,
) => Promise<T[]>;

export type RelationsMap = {
  [key: string]: AnyObject;
};
