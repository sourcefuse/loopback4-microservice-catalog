import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {Entity, juggler, Filter} from '@loopback/repository';
import {CONNECTORS} from './query/enum';
import {PostgreqlQueryBuilder} from './query/postgres-query-builder.provider';
import {BuilderConfig, WhereBuilderFunction} from './query/types';
import {HttpErrors} from '@loopback/rest';
import {Errors} from './query/errors';
import {JoinExecutor} from './types';
import {ModelConstructor} from '../types';
import {QueryBuilderBindings} from './query/keys';

@injectable({scope: BindingScope.SINGLETON})
export class JoinProvider implements Provider<JoinExecutor> {
  constructor(
    @inject(QueryBuilderBindings.PostgresQueryBuilder)
    private query: typeof PostgreqlQueryBuilder,
    @inject(QueryBuilderBindings.WhereBuilder)
    private whereBuilder: WhereBuilderFunction,
  ) {}

  value(): JoinExecutor {
    return <T extends Entity>(
      filter: Filter<T>,
      datasource: juggler.DataSource,
      model: ModelConstructor<T>,
    ) => {
      let queryBuilder;
      let config: BuilderConfig = {
        schema: 'public',
        idType: 'uuid',
      };
      switch (datasource.settings.connector) {
        case CONNECTORS.POSTGRESQL:
          queryBuilder = new this.query<T>(model, this.whereBuilder, config);
          break;
        default:
          throw new HttpErrors.InternalServerError(
            Errors.UNSUPPORTED_CONNECTOR,
          );
      }

      const query = queryBuilder.select(model, filter);
      try {
        return datasource.execute(query.sql, query.params) as Promise<T[]>;
      } catch (e) {
        throw new HttpErrors.InternalServerError(Errors.UNEXPECTED);
      }
    };
  }
}
