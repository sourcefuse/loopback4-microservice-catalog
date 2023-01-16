import {
  BindingScope,
  inject,
  injectable,
  Interceptor,
  InvocationContext,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {RoleNames} from '../constants';
import {ErrorKeys, RoleTypeValue} from '../enums';
import {UserTenantServiceComponentBindings} from '../keys';
import {ControllerMethodWithSpecs} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class TenantFilterInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(UserTenantServiceComponentBindings.CURRENT_USER)
    private currentUser: IAuthUserWithPermissions,
  ) {}

  value() {
    return this.intercept.bind(this);
  }

  async intercept<T>(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<T>,
  ) {
    // filter should not be added for a superadmin
    if (this.currentUser.role === RoleNames[RoleTypeValue.SuperAdmin]) {
      return next();
    }

    // return if tenantId not available in the user
    if (!this.currentUser.tenantId) {
      throw new HttpErrors.BadRequest(ErrorKeys.TenantIdNotAvailable);
    }

    const paramMetadata = (
      invocationCtx.source?.value as ControllerMethodWithSpecs
    ).spec.parameters;
    const filterIndex = paramMetadata.findIndex(
      (param: {name: string}) => param.name === 'filter',
    );
    if (filterIndex > -1) {
      let filterValue = invocationCtx.args[filterIndex];
      if (filterValue) {
        filterValue.where = this.updateWhere(
          filterValue.where,
          this.currentUser.tenantId,
        );
      } else {
        filterValue = {
          where: {
            tenantId: this.currentUser.tenantId,
          },
        };
      }
      invocationCtx.args[filterIndex] = filterValue;
    }
    const whereIndex = paramMetadata.findIndex(
      (param: {name: string}) => param.name === 'where',
    );
    if (whereIndex > -1) {
      const whereValue = invocationCtx.args[whereIndex];
      invocationCtx.args[whereIndex] = this.updateWhere(
        whereValue,
        this.currentUser.tenantId,
      );
    }
    return next();
  }

  updateWhere(where: Record<string, string>, tenantId: string) {
    if (where) {
      return {
        and: [where, {tenantId}],
      };
    }
    return {tenantId};
  }
}
