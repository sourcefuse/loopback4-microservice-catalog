// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Count,
  DataObject,
  Entity,
  Filter,
  FilterExcludingWhere,
  Model,
  ModelDefinition,
  RelationMetadata,
  RelationType,
  Where,
} from '@loopback/repository';

export type CrudRestService<T extends Entity, S extends Entity = T> = {
  create: (token: string, data: DataObject<T>) => Promise<T>;
  findById: (
    token: string,
    id: string,
    filter?: FilterExcludingWhere<T> | string,
  ) => Promise<S>;
  find: (token: string, filter?: Filter<T> | string) => Promise<S[]>;
  count: (token: string, where?: Where<T> | string) => Promise<Count>;
  updateById: (token: string, id: string, data: DataObject<T>) => Promise<void>;
  replaceById: (
    token: string,
    id: string,
    data: DataObject<T>,
  ) => Promise<void>;
  deleteById: (token: string, id: string) => Promise<void>;
  update: (
    token: string,
    data: DataObject<T>,
    where?: Where<T> | string,
  ) => Promise<Count>;
  delete: (token: string, where?: Where<T> | string) => Promise<void>;
};

export type CrudServiceForModel<T extends Model> = {
  create: (token: string, data: DataObject<T>) => Promise<T>;
  find: (token: string, filter?: Filter<T>) => Promise<T[]>;
  count: (token: string, where?: Where<T>) => Promise<Count>;
  update: (token: string, data: T, where?: Where<T>) => Promise<Count>;
};

export type ModifiedRestService<T extends Entity> = {
  create: (data: DataObject<T>, token?: string) => Promise<T>;
  findById: (
    id: string,
    filter?: FilterExcludingWhere<T>,
    token?: string,
  ) => Promise<T>;
  find: (
    filter?: Filter<T>,
    token?: string,
    inclusionConfig?: RestRelationConfig,
  ) => Promise<T[]>;
  count: (where?: Where<T>, token?: string) => Promise<Count>;
  updateById: (
    id: string,
    data: DataObject<T>,
    token?: string,
  ) => Promise<void>;
  replaceById: (
    id: string,
    data: DataObject<T>,
    token?: string,
  ) => Promise<void>;
  deleteById: (id: string, token?: string) => Promise<void>;
  update: (
    data: DataObject<T>,
    where?: Where<T>,
    token?: string,
  ) => Promise<Count>;
  delete: (where?: Where<T>, token?: string) => Promise<void>;
};

export type CrudRestServiceModifier<T extends Entity> = (
  service: CrudRestService<T>,
  model: ModelConstructor<T>,
  config: RestRelationConfig[],
) => ModifiedRestService<T>;

export type RestRelationConfig = {
  name: string;
  throughRelation?: string;
  disableStringify?: boolean;
} & (
  | RestRelationConfigWithClass
  | RestRelationConfigWithKey
  | RestRelationConfigWithModelClass
);

export type RestRelationConfigWithKey = {
  serviceKey: string;
};
export type RestRelationConfigWithClass = {
  serviceClass: Function;
};
export type RestRelationConfigWithModelClass = {
  modelClass: ModelConstructor<Entity>;
};

export function isConfigWithKey(
  config: RestRelationConfig,
): config is RestRelationConfig & RestRelationConfigWithKey {
  return (config as RestRelationConfigWithKey).serviceKey !== undefined;
}

export function isConfigWithModelClass(
  config: RestRelationConfig,
): config is RestRelationConfig & RestRelationConfigWithModelClass {
  return (config as RestRelationConfigWithModelClass).modelClass !== undefined;
}

export type ModelConstructor<T extends Entity> = (new () => T) & {
  definition: ModelDefinition;
  modelName: string;
};

export interface IRestResolver<Parent extends Entity, Child extends Entity> {
  type: RelationType;
  resolve(
    params: RestResolverParams<Parent, Child>,
  ): Promise<ResolvedMap<Parent, Child>>;
  link(params: RestLinkerParams<Parent, Child>): Promise<Parent>;
}

export type RestResolverParams<Parent extends Entity, Child extends Entity> = {
  relationConfig: RestRelationConfig;
  relationMetadata: RelationMetadata;
  results: Parent[];
  scope?: Filter<Child>;
  token?: string;
};

export type RestLinkerParams<Parent extends Entity, Child extends Entity> = {
  relationMetadata: RelationMetadata;
  parent: Parent;
  resolvedDataMap: ResolvedMap<Parent, Child>;
  token?: string;
};

export type ResolvedMap<Parent extends Entity, Child extends Entity> = Map<
  Child[keyof Child] | Parent[keyof Parent],
  Child | Child[]
>;

export type ResolverWithMetadata<T extends Entity, S extends Entity> = {
  resolver: IRestResolver<T, S>;
  metadata: RelationMetadata;
};
