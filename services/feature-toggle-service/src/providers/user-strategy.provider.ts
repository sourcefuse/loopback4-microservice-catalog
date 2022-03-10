import {Getter, inject, Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {StrategyBindings} from '../keys';
import {
  FeatureRepository,
  FeatureToggleRepository,
  StrategyRepository,
} from '../repositories';
import {FeatureFlagMetadata, FeatureInterface} from '../types';

export class UserStrategyProvider implements Provider<FeatureInterface> {
  constructor(
    @inject.getter(StrategyBindings.METADATA)
    private readonly getMetadata: Getter<FeatureFlagMetadata>,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: IAuthUserWithPermissions | undefined,
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
        itemId: this.user?.userTenantId,
      },
    });

    //When toggle is not set
    if (!featureToggle) {
      const strategy = await this.strategyRepository.findOne({
        where: {
          name: 'User',
        },
      });

      await this.featureToggleRepository.create({
        featureId: feature?.id,
        strategyId: strategy?.id,
        itemId: this.user?.userTenantId,
        status: true,
      });

      return true;
    }

    return featureToggle.status;
  }
}
