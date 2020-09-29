import {Provider} from '@loopback/context';
import {CasbinConfig, CasbinEnforcerConfigGetterFn, IAuthUserWithPermissions} from 'loopback4-authorization';
import * as path from 'path';

export class CasbinEnforcerConfigProvider
  implements Provider<CasbinEnforcerConfigGetterFn> {
  constructor() {}

  value(): CasbinEnforcerConfigGetterFn {
    return (authUser: IAuthUserWithPermissions, resource: string, isCasbinPolicy?: boolean) =>
      this.action(authUser, resource, isCasbinPolicy);
  }

  async action(authUser: IAuthUserWithPermissions, resource: string, isCasbinPolicy?: boolean): Promise<CasbinConfig> {
    const model = path.resolve(
      __dirname,
      './../../fixtures/casbin/model.conf',
    );

    // Write business logic to find out the allowed resources for this user. Below is a dummy value.
    const allowedRes = [{resource: 'session', permission: "CreateMeetingSession"}];

    const policy = path.resolve(__dirname, './../../fixtures/casbin/policy.csv');

    const result: CasbinConfig = {
      model,
      allowedRes,
      policy
    }
    return result;
  }
}
