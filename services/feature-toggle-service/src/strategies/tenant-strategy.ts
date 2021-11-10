import {Context, Strategy} from 'unleash-client';

export class TenantStrategy extends Strategy {
  constructor() {
    super('Tenant'); // name of the strategy
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isEnabled(parameters: any, context: Context) {
    return parameters.tenantId.indexOf(context.myTenant) !== -1;
  }
}
