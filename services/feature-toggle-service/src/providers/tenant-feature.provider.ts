import {inject, Provider} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Unleash} from 'unleash-client'; //NOSONAR
import {UNLEASH_CONST} from '../keys';
import {FeatureInterface} from '../types';

export class TenantFeatureProvider implements Provider<FeatureInterface> {
  constructor(
    @inject(UNLEASH_CONST)
    private readonly unleashConst: Unleash,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: IAuthUserWithPermissions | undefined,
  ) {}
  value(): FeatureInterface {
    return () => {
      const context = {
        myTenant: this.user?.tenantId,
      };
      return this.unleashConst.isEnabled('tenant-feature', context);
    };
  }
}
