import {inject, Provider} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Unleash} from 'unleash-client';
import {UNLEASH_CONST} from '../keys';
import {FeatureInterface} from '../types';

export class UserFeatureProvider implements Provider<FeatureInterface> {
  constructor(
    @inject(UNLEASH_CONST)
    private readonly unleashConst: Unleash,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: IAuthUserWithPermissions | undefined,
  ) {}
  value(): FeatureInterface {
    return () => {
      const context = {
        email: this.user?.username,
      };
      return this.unleashConst.isEnabled('user-feature', context);
    };
  }
}
