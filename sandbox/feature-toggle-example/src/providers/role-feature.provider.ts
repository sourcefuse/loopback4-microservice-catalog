import {inject, Provider} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Unleash} from 'unleash-client'; //NOSONAR
import {
  FeatureInterface,
  UNLEASH_CONST,
} from '@sourceloop/feature-toggle-service';

export class RoleFeatureProvider implements Provider<FeatureInterface> {
  constructor(
    @inject(UNLEASH_CONST)
    private readonly unleashConst: Unleash,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: IAuthUserWithPermissions | undefined,
  ) {}
  value(): FeatureInterface {
    return () => {
      const context = {
        role: this.user?.role,
      };
      return this.unleashConst.isEnabled('role-feature', context);
    };
  }
}
