// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {juggler, Model} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {MySqlQueryBuilder, PsqlQueryBuilder} from '../classes';
import {CONNECTORS, Errors} from '../const';
import {SearchServiceBindings} from '../keys';
import {SearchResult} from '../models';
import {
  isSearchableModel,
  SearchFunctionType,
  SearchServiceConfig,
} from '../types';

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
      let models;
      if (search.sources && search.sources.length > 0) {
        const sources = search.sources;
        models = this.config.models.filter(model => {
          if (isSearchableModel(model)) {
            return sources.includes(model.identifier ?? model.model.modelName);
          } else {
            return sources.includes(model.modelName);
          }
        });
      } else {
        models = this.config.models;
      }
      const type = this.config.type ?? SearchResult;

      const {query, params} = queryBuilder.build(
        models,
        this.config.ignoreColumns,
        type,
      );

      try {
        return this.datasource.execute(query, params) as Promise<T[]>;
      } catch (e) {
        throw new HttpErrors.InternalServerError(Errors.FAILED);
      }
    };
  }
}
