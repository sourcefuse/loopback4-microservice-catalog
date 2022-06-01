import {Constructor} from '@loopback/context';
import {Entity, property} from '@loopback/repository';
import {AbstractConstructor, IBaseEntityConfig, IBaseEntity} from './types';

export function BaseEntityMixin<T extends Entity>(
  base: Constructor<T> | AbstractConstructor<T>,
  config?: IBaseEntityConfig,
): typeof Entity & AbstractConstructor<IBaseEntity> {
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
  return BaseEntity as typeof Entity & AbstractConstructor<IBaseEntity>;
}
