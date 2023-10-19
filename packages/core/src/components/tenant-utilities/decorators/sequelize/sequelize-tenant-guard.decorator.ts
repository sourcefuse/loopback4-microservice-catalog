import {SequelizeCrudRepository} from '@loopback/sequelize';
import {AbstractConstructor} from '../../../../mixins/types';
import {SequelizeTenantGuardMixin} from '../../mixins/sequelize';
import {EntityWithTenantId, ITenantGuard} from '../../types';

/**
 * This function returns a class decorator that adds a tenant guard mixin
 * to the given repository class.
 *
 * @param constructor - The repository class to decorate
 */
export function sequelizetenantGuard() {
  return <
    M extends EntityWithTenantId,
    ID,
    Relations extends object,
    S extends AbstractConstructor<SequelizeCrudRepository<M, ID, Relations>>,
  >(
    constructor: S &
      AbstractConstructor<SequelizeCrudRepository<M, ID, Relations>>,
  ) => {
    class GuardedRepo extends SequelizeTenantGuardMixin(constructor) {
      public tenantGuardService: ITenantGuard<M, ID>;
    }
    // This code is used to set the name of the GuardedRepo class back to the original name
    Object.defineProperty(GuardedRepo, 'name', {value: constructor.name});
    return GuardedRepo as typeof constructor;
  };
}
