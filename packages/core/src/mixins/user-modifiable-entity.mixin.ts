import {Constructor} from '@loopback/context';
import {Entity, property} from '@loopback/repository';
import {BaseEntityMixin} from './base-entity.mixin';
import {
  AbstractConstructor,
  IUserModifiableEntity,
  IUserModifiableEntityConfig,
} from './types';

/**
 * @param UserModifiableEntityMixin Exporting function `UserModifiableEntityMixin`,
 * in which class T extends Entity and S extends Constructor | AbstractConstructor.
 * It takes an abstract class `UserModifiableEntity` and returns a new class that extends the `base` class and
 * adds the properties createdBy and modifiedBy.
 * @param {S} base - The base class to extend.
 * @param {IUserModifiableEntityConfig} [config] - IUserModifiableEntityConfig
 * @returns A function that takes a base class `UserModifiableEntity` and a config object
 * and returns a new class `AbstractConstructor` that extends
 * the base class and implements the IUserModifiableEntity interface.
 */
export function UserModifiableEntityMixin<
  T extends Entity,
  S extends Constructor<T> | AbstractConstructor<T>,
>(
  base: S,
  config?: IUserModifiableEntityConfig,
): typeof base & AbstractConstructor<IUserModifiableEntity> {
  abstract class UserModifiableEntity extends BaseEntityMixin(base, {
    createdOn: config?.createdOn,
    modifiedOn: config?.modifiedOn,
  }) {
    @property({
      type: 'string',
      name: 'created_by',
      ...(config?.createdBy ?? {}),
    })
    createdBy?: string;

    @property({
      type: 'string',
      name: 'modified_by',
      ...(config?.modifiedBy ?? {}),
    })
    modifiedBy?: string;
  }

  return UserModifiableEntity as typeof base &
    AbstractConstructor<IUserModifiableEntity>;
}
