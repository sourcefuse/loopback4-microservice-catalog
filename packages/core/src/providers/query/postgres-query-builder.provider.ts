import {Entity} from '@loopback/repository';
import {RelationMap} from '../../mixins/types';
import {QueryBuilder} from './base-query-builder.provider';

export class PostgreqlQueryBuilder<
  T extends Entity,
  S extends RelationMap,
  R extends S[keyof S],
> extends QueryBuilder<T, S, R> {}
