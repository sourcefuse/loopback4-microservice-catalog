import {Context, Provider, Getter, inject} from '@loopback/core';
import {FeatureFlagFn, FeatureFlagMetadata, FeatureInterface} from '../types';
import {StrategyBindings} from '../keys';

export class FeatureFlagActionProvider implements Provider<FeatureFlagFn> {
  constructor(
    @inject.getter(StrategyBindings.METADATA)
    private readonly getMetadata: Getter<FeatureFlagMetadata>,
    @inject.context()
    private readonly ctx: Context,
  ) {}
  value(): FeatureFlagFn {
    return () => this.action();
  }

  async action(): Promise<boolean> {
    const metadata: FeatureFlagMetadata = await this.getMetadata();
    if (
      !metadata ||
      (metadata.strategies.length === 1 && metadata.strategies[0] === '*')
    ) {
      return true;
    }
    const strategies = metadata.strategies;
    for (const item of strategies) {
      const featureToggle = await this.ctx.get<FeatureInterface>(item);
      const isFeatureEnabled = await featureToggle();
      if (!isFeatureEnabled) {
        return false;
      }
    }
    return true;
  }
}
