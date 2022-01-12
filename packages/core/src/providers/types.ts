import {Entity, Filter, juggler, RelationMetadata} from '@loopback/repository';
import {BuilderConfig, ModelConstructor} from '..';
export type JoinExecutor = <T extends Entity>(
  filter: Filter<T>,
  datasource: juggler.DataSource,
  model: ModelConstructor<T>,
  options?: BuilderConfig,
) => Promise<T[]>;

export type RelationsMap = {
  [key: string]: RelationMetadata;
};
