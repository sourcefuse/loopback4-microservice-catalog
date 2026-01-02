import {Provider, inject} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {DatasourceIdentifierFn} from 'loopback4-dynamic-datasource';
import {IAuthUserWithPermissions} from '../../bearer-verifier';

/**
 * This provider gives the identifier that can be used to
 * identify which datasource config is to be used.
 */
export class DatasourceIdentifierProvider implements Provider<DatasourceIdentifierFn> {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: IAuthUserWithPermissions,
  ) {}
  value(): DatasourceIdentifierFn {
    return async requestCtx => {
      if (this.user?.tenantId) {
        return {
          id: this.user.tenantId,
        };
      }
      return null;
    };
  }
}
