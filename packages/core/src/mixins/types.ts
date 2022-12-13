import {PropertyDefinition} from '@loopback/repository';

/**
 * Exporting the interface `IBaseEntityConfig` for the base entity config with two properties(createdOn, modifiedOn).
 * Extending the interface `IBaseEntityConfig` with two new properties(createdBy, modifiedBy) from `IUserModifiableEntityConfig`.
 * Exporting the interface `IBaseEntity` for the base entity config with two properties(createdOn, modifiedOn).
 * Extending the interface `IBaseEntity` with two new properties(createdBy, modifiedBy) from `IUserModifiableEntity`.
 */
export interface IBaseEntityConfig {
  createdOn?: Partial<PropertyDefinition>;
  modifiedOn?: Partial<PropertyDefinition>;
}

export interface IUserModifiableEntityConfig extends IBaseEntityConfig {
  createdBy?: Partial<PropertyDefinition>;
  modifiedBy?: Partial<PropertyDefinition>;
}

export interface IBaseEntity {
  createdOn?: Date;
  modifiedOn?: Date;
}

export interface IUserModifiableEntity extends IBaseEntity {
  createdBy?: string;
  modifiedBy?: string;
}

// sonarignore:start
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractConstructor<T> = abstract new (...args: any[]) => T;
// sonarignore:end
