import {Context, Strategy} from 'unleash-client';

export class TenantStrategy extends Strategy {
  constructor() {
    super('User'); // name of the strategy
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isEnabled(parameters: any, context: Context) {
    return parameters.email.indexOf(context.email) !== -1;
  }
}
