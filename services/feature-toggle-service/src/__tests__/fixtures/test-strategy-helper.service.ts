import {BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class TestStrategyHelperService {
  constructor() {}

  async isFeatureEnabled(strategyKey: string): Promise<boolean> {
    return true;
  }
}
