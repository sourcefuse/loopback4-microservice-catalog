import {Constructor} from '@loopback/context';
import {Entity, property} from '@loopback/repository';
import {AbstractConstructor, IBaseEntityConfig, IBaseEntity} from './types';

/**
 * @param {BaseEntityMixin} - Exporting function `BaseEntityMixin`,
 * in which class T extends Entity and S extends Constructor | AbstractConstructor.
 * It takes an abstract class `BaseEntity` and returns a new class that extends the original class `base` and
 * adds two properties to it,which are createdOn , modifiedOn.
 * @param {S} base - The base class that you want to extend.
 * @param {IBaseEntityConfig} [config] - IBaseEntityConfig
 * @returns A function that takes a base class `BaseEntity` and returns a new class `AbstractConstructor<IBaseEntity>`
 * that extends the base class.
 */
export function BaseEntityMixin<
  T extends Entity,
  S extends Constructor<T> | AbstractConstructor<T>,
>(
  base: S,
  config?: IBaseEntityConfig,
): typeof base & AbstractConstructor<IBaseEntity> {
  abstract class BaseEntity extends base {
    @property({
      type: 'date',
      default: () => new Date(),
      name: 'created_on',
      ...(config?.createdOn ?? {}),
    })
    createdOn?: Date;

    @property({
      type: 'date',
      default: () => new Date(),
      name: 'modified_on',
      ...(config?.modifiedOn ?? {}),
    })
    modifiedOn?: Date;
  }
  return BaseEntity as typeof base & AbstractConstructor<IBaseEntity>;
}
