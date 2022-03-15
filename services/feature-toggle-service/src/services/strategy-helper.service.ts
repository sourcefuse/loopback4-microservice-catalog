import {inject} from '@loopback/context';
import {BindingScope, Getter, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IAuthUserWithPermissions, ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {StrategyKey} from '../enums';
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

  async isFeatureEnabled(strategyKey: string): Promise<boolean> {
    const metadata: FeatureFlagMetadata = await this.getMetadata();
    const featureKey = metadata.featureKey;

    let itemId: string | undefined;
    if (strategyKey === StrategyKey.System) {
      const feature = await this.featureRepository.findOne({
        where: {
          key: featureKey,
        },
      });
      itemId = feature?.id;
    } else if (strategyKey === StrategyKey.Tenant) {
      itemId = this.user?.tenantId;
    } else if (strategyKey === StrategyKey.User) {
      itemId = this.user?.userTenantId;
    } else {
      this.logger.error('Incorrect Strategy Key');
      return false;
    }

    const featureToggle = await this.featureToggleRepository.findOne({
      where: {
        featureKey: featureKey,
        strategyKey: strategyKey,
        itemId: itemId,
      },
    });

    //When toggle is not set
    if (!featureToggle) {
      return true;
    }

    if (!featureToggle.status) {
      this.logger.error(
        `${featureKey} Feature is disabled at ${strategyKey} Level`,
      );
    }
    return featureToggle.status;
  }
}
