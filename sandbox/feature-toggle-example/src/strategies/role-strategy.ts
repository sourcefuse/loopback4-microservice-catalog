import {Context, Strategy} from 'unleash-client';

export class RoleStrategy extends Strategy {
  constructor() {
    super('Role'); // name of the strategy
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isEnabled(parameters: any, context: Context) {
    return parameters.role.indexOf(context.role) !== -1;
  }
}
