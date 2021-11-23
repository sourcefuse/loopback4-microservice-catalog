import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {Entity, juggler} from '@loopback/repository';
import {FilterWithJoin, RelationMap} from '../mixins/types';
import {CONNECTORS} from './query/enum';
import {PostgreqlQueryBuilder} from './query/postgres-query-builder.provider';
import {WhereBuilderFunction} from './query/types';
import {HttpErrors} from '@loopback/rest';
import {Errors} from './query/errors';
import {JoinBindings} from '../keys';
import {JoinExecutor} from './types';
import {ModelConstructor} from '../types';
import {RelationsMap} from '.';

@injectable({scope: BindingScope.SINGLETON})
export class JoinProvider implements Provider<JoinExecutor> {
  constructor(
    @inject(JoinBindings.PostgresQueryBuilder)
    private query: typeof PostgreqlQueryBuilder,
    @inject(JoinBindings.WhereBuilder)
    private whereBuilder: WhereBuilderFunction,
  ) {}

  value(): JoinExecutor {
    return <T extends Entity, S extends RelationMap, R extends S[keyof S]>(
      filter: FilterWithJoin<T, S, R>,
      datasource: juggler.DataSource,
      model: ModelConstructor<T>,
      relations: RelationsMap,
      idType?: string,
    ) => {
      let queryBuilder;

      switch (datasource.settings.connector) {
        case CONNECTORS.POSTGRESQL:
          queryBuilder = new this.query<T, S, R>(
            model,
            relations,
            this.whereBuilder,
            'public',
            idType,
          );
          break;
        default:
          throw new HttpErrors.InternalServerError(
            Errors.UNSUPPORTED_CONNECTOR,
          );
      }

      const query = queryBuilder.build(filter);
      try {
        return datasource.execute(query.sql, query.params) as Promise<T[]>;
      } catch (e) {
        throw new HttpErrors.InternalServerError(Errors.UNEXPECTED);
      }
    };
  }
}
