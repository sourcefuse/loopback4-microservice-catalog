import {inject, Provider} from '@loopback/core';
import {StrategyKey} from '../enums';
import {StrategyHelperService} from '../services';
import {FeatureInterface} from '../types';

export class TenantStrategyProvider implements Provider<FeatureInterface> {
  constructor(
    @inject('services.StrategyHelperService')
    private readonly strategyHelperService: StrategyHelperService,
  ) {}
  value(): FeatureInterface {
    return () => this.isEnabled();
  }

  async isEnabled() {
    return this.strategyHelperService.isFeatureEnabled(StrategyKey.Tenant);
  }
}
