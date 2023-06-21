import {Constructor} from '@loopback/context';
import {Entity, property} from '@loopback/repository';
import {AbstractConstructor, IBaseEntityConfig, IBaseEntity} from './types';

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
