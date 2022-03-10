import {Getter, inject, Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {StrategyBindings} from '../keys';
import {
  FeatureRepository,
  FeatureToggleRepository,
  StrategyRepository,
} from '../repositories';
import {FeatureFlagMetadata, FeatureInterface} from '../types';

export class SystemStrategyProvider implements Provider<FeatureInterface> {
  constructor(
    @inject.getter(StrategyBindings.METADATA)
    private readonly getMetadata: Getter<FeatureFlagMetadata>,
    @repository(FeatureRepository)
    public featureRepository: FeatureRepository,
    @repository(FeatureToggleRepository)
    public featureToggleRepository: FeatureToggleRepository,
    @repository(StrategyRepository)
    public strategyRepository: StrategyRepository,
  ) {}
  value(): FeatureInterface {
    return () => this.isEnabled();
  }

  async isEnabled() {
    const metadata: FeatureFlagMetadata = await this.getMetadata();
    const featureName = metadata.feature;

    const feature = await this.featureRepository.findOne({
      where: {
        name: featureName,
      },
    });
    if (!feature) {
      return false;
    }

    const featureToggle = await this.featureToggleRepository.findOne({
      where: {
        featureId: feature.id,
        itemId: feature.id,
      },
    });

    //When toggle is not set
    if (!featureToggle) {
      const strategy = await this.strategyRepository.findOne({
        where: {
          name: 'System',
        },
      });

      await this.featureToggleRepository.create({
        featureId: feature?.id,
        strategyId: strategy?.id,
        itemId: feature?.id,
        status: feature.defaultValue,
      });

      return feature.defaultValue;
    }

    return featureToggle.status;
  }
}
