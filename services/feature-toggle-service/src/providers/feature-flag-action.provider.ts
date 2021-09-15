import {Context, Provider} from '@loopback/core';
import {Getter, inject} from '@loopback/context';
import {FeatureFlagFn, FeatureFlagMetadata, FeatureInterface} from '../types';
import {StrategyBindings} from '../keys';

export class FeatureFlagActionProvider implements Provider<FeatureFlagFn> {
  result = false;
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

    if (metadata.features.length === 1 && metadata.features[0] === '*') {
      this.result = true;
      return this.result;
    }
    const features = metadata.features;
    for (const item in features) {
      const isFeatureEnabled = await this.ctx.get<FeatureInterface>(item);
      this.result = isFeatureEnabled() && this.result;
    }
    return this.result;
  }
}
