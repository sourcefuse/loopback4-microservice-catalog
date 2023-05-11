import {DefaultCrudRepository} from '@loopback/repository';
import {AbstractConstructor} from '../../../mixins/types';
import {TenantGuardMixin} from '../mixins';
import {EntityWithTenantId, ITenantGuard} from '../types';

/**
 * This function returns a class decorator that adds a tenant guard mixin
 * to the given repository class.
 *
 * @param constructor - The repository class to decorate
 */
export function tenantGuard() {
  return <
    M extends EntityWithTenantId,
    ID,
    Relations extends object,
    S extends AbstractConstructor<DefaultCrudRepository<M, ID, Relations>>,
  >(
    constructor: S &
      AbstractConstructor<DefaultCrudRepository<M, ID, Relations>>,
  ) => {
    class GuardedRepo extends TenantGuardMixin(constructor) {
      public tenantGuardService: ITenantGuard<M, ID>;
    }
    // This code is used to set the name of the GuardedRepo class back to the original name
    Object.defineProperty(GuardedRepo, 'name', {value: constructor.name});
    return GuardedRepo as typeof constructor;
  };
}
