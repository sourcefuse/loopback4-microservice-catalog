import {inject} from '@loopback/context';
import {BindingScope, Getter, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IAuthUserWithPermissions, ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {StrategyBindings} from '../keys';
import {
  FeatureRepository,
  FeatureToggleRepository,
  StrategyRepository,
} from '../repositories';
import {FeatureFlagMetadata} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class StrategyHelperService {
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
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
  ) {}

  async isFeatureEnabled(strategyName: string): Promise<boolean> {
    const metadata: FeatureFlagMetadata = await this.getMetadata();
    const featureName = metadata.feature;

    const feature = await this.featureRepository.findOne({
      where: {
        name: featureName,
      },
    });
    if (!feature) {
      this.logger.error('Feature does not exist');
      return false;
    }

    let itemId = feature.id;
    if (strategyName === 'Tenant') {
      itemId = this.user?.tenantId;
    } else if (strategyName === 'User') {
      itemId = this.user?.userTenantId;
    }

    const featureToggle = await this.featureToggleRepository.findOne({
      where: {
        featureId: feature.id,
        itemId: itemId,
      },
    });

    //When toggle is not set
    if (!featureToggle) {
      const strategy = await this.strategyRepository.findOne({
        where: {
          name: strategyName,
        },
      });

      await this.featureToggleRepository.create({
        featureId: feature?.id,
        strategyId: strategy?.id,
        itemId: itemId,
        status: true,
      });

      return true;
    }

    if (!featureToggle.status) {
      this.logger.error(
        `${featureName} Feature is disabled at ${strategyName} Level`,
      );
    }
    return featureToggle.status;
  }
}
