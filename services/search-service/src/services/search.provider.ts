// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {juggler, Model} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {MySqlQueryBuilder, PsqlQueryBuilder} from '../classes';
import {CONNECTORS, Errors} from '../const';
import {SearchServiceBindings} from '../keys';
import {SearchFunctionType, SearchServiceConfig} from '../types';
import {ModelProviderFn} from './model.provider';

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
    @inject(SearchServiceBindings.modelProvider)
    private readonly modelProvider: ModelProviderFn,
  ) {}

  value(): SearchFunctionType<T> {
    return async search => {
      let queryBuilder;

      if (!search.match) {
        throw new HttpErrors.BadRequest(Errors.MISSING_MATCH);
      }

      switch (this.datasource.settings.connector) {
        case CONNECTORS.POSTGRESQL:
          queryBuilder = new this.psqlBuilder<T>(
            search,
            this.datasource.settings.schema,
          );
          break;
        case CONNECTORS.MYSQL:
          queryBuilder = new this.mySQLBuilder<T>(search);
          break;
        default:
          throw new HttpErrors.InternalServerError(
            Errors.UNSUPPORTED_CONNECTOR,
          );
      }
      const {query, params} = await this.modelProvider(search, queryBuilder);

      try {
        return await (this.datasource.execute(query, params) as Promise<T[]>);
      } catch (e) {
        throw new HttpErrors.InternalServerError(Errors.FAILED);
      }
    };
  }
}
