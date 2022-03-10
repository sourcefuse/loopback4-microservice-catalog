import {inject, Provider} from '@loopback/core';
import {StrategyHelperService} from '../services';
import {FeatureInterface} from '../types';

export class SystemStrategyProvider implements Provider<FeatureInterface> {
  constructor(
    @inject('services.StrategyHelperService')
    private readonly strategyHelperService: StrategyHelperService,
  ) {}
  value(): FeatureInterface {
    return () => this.isEnabled();
  }

  async isEnabled() {
    return this.strategyHelperService.isFeatureEnabled('System');
  }
}
