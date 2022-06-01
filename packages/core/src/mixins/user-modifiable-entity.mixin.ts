import {Constructor} from '@loopback/context';
import {Entity, property} from '@loopback/repository';
import {BaseEntityMixin} from './base-entity.mixin';
import {
  AbstractConstructor,
  IUserModifiableEntity,
  IUserModifiableEntityConfig,
} from './types';

export function UserModifiableEntityMixin<T extends Entity>(
  base: Constructor<T> | AbstractConstructor<T>,
  config?: IUserModifiableEntityConfig,
): typeof Entity & AbstractConstructor<IUserModifiableEntity> {
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

  return UserModifiableEntity as typeof Entity &
    AbstractConstructor<IUserModifiableEntity>;
}
