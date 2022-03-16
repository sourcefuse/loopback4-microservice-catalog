import {inject, Provider} from '@loopback/core';
import {StrategyHelperService} from '../../services';
import {FeatureInterface} from '../../types';

export class TestSystemStrategyProvider implements Provider<FeatureInterface> {
  constructor(
    @inject('test.StrategyHelperService')
    private readonly strategyHelperService: StrategyHelperService,
  ) {}
  value(): FeatureInterface {
    return () => this.isEnabled();
  }

  async isEnabled() {
    return this.strategyHelperService.isFeatureEnabled('System');
  }
}
