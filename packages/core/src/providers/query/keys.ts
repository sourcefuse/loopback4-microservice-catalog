import {BindingKey, Constructor} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {BINDING_PREFIX} from '../../constants';
import {ModelConstructor} from '../../types';
import {PostgreqlQueryBuilder} from './postgres-query-builder.provider';
import {BuilderConfig, WhereBuilderFunction} from './types';

export namespace QueryBuilderBindings {
  export const Model = BindingKey.create<ModelConstructor<Entity>>(
    `${BINDING_PREFIX}.joined.model`,
  );
  export const WhereBuilder = BindingKey.create<WhereBuilderFunction>(
    `${BINDING_PREFIX}.query.builder.where`,
  );
  export const QueryBuilderConfig = BindingKey.create<BuilderConfig>(
    `${BINDING_PREFIX}.query.builder.config`,
  );
  export const PostgresQueryBuilder = BindingKey.create<
    Constructor<PostgreqlQueryBuilder<Entity>>
  >(`${BINDING_PREFIX}.query.builder.psql`);
}
