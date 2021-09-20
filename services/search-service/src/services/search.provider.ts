import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {juggler, Model} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {CONNECTORS, Errors} from '../const';
import {SearchServiceBindings} from '../keys';
import {SearchResult} from '../models';
import {SearchFunctionType, SearchServiceConfig} from '../types';
import {MySqlQueryBuilder, PsqlQueryBuilder} from '../classes';

@injectable({scope: BindingScope.SINGLETON})
export class SearchProvider<T extends Model>
  implements Provider<SearchFunctionType<T>>
{
  constructor(
    @inject(SearchServiceBindings.Config)
    private readonly config: SearchServiceConfig<T>,
    @inject(`datasources.${SearchServiceBindings.DATASOURCE_NAME}`)
    private readonly datasource: juggler.DataSource,
    @inject(SearchServiceBindings.MySQLQueryBuilder)
    private readonly mySQLBuilder: typeof MySqlQueryBuilder,
    @inject(SearchServiceBindings.PostgreSQLQueryBuilder)
    private readonly psqlBuilder: typeof PsqlQueryBuilder,
  ) {}

  value(): SearchFunctionType<T> {
    return search => {
      let queryBuilder;

      if (!search.match) {
        throw new HttpErrors.BadRequest(Errors.MISSING_MATCH);
      }

      switch (this.datasource.settings.connector) {
        case CONNECTORS.POSTGRESQL:
          queryBuilder = new this.psqlBuilder(
            search,
            this.datasource.settings.schema,
          );
          break;
        case CONNECTORS.MYSQL:
          queryBuilder = new this.mySQLBuilder(search);
          break;
        default:
          throw new HttpErrors.InternalServerError(
            Errors.UNSUPPORTED_CONNECTOR,
          );
      }

      const models = this.config.models;
      const type = this.config.type ?? SearchResult;
      const [query, params] = queryBuilder.build(models, type);

      return this.datasource.execute(query, params) as Promise<T[]>;
    };
  }
}
