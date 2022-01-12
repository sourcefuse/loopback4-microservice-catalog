import {BindingScope, inject} from '@loopback/context';
import {Entity} from '@loopback/repository';
import {ModelConstructor} from '../../types';
import {QueryBuilder} from './base-query.builder';
import {BuilderConfig, WhereBuilderFunction} from './types';
import {QueryBuilderBindings} from './keys';
export class PostgreqlQueryBuilder<T extends Entity> extends QueryBuilder<T> {
  constructor(
    @inject(QueryBuilderBindings.Model, {scope: BindingScope.TRANSIENT})
    model: ModelConstructor<T>,
    @inject(QueryBuilderBindings.WhereBuilder, {scope: BindingScope.TRANSIENT})
    whereBuilder: WhereBuilderFunction,
    @inject(QueryBuilderBindings.QueryBuilderConfig)
    config: BuilderConfig,
  ) {
    super(model, whereBuilder, config);
  }
}
