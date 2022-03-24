import {SystemStrategyProvider} from '../../providers';
import {expect, createStubInstance} from '@loopback/testlab';
import {StrategyHelperService} from '../../services';
import sinon from 'sinon';
import {StrategyBindings} from '../../keys';
import {IAuthUserWithPermissions} from 'loopback4-authorization';
import {
  FeatureRepository,
  FeatureToggleRepository,
  StrategyRepository,
} from '../../repositories';
import {Getter} from '@loopback/core';
import {FeatureFlagMetadata} from '../../types';
import {ILogger} from '@sourceloop/core';
import {LogMessage} from '@sourceloop/core/dist/components/logger-extension/types';

describe('System Strategy provider', () => {
  let systemStrategyProvider: SystemStrategyProvider;
  let strategyHelperService: StrategyHelperService;
  let metadataGetterStub: Getter<FeatureFlagMetadata>;
  let user: IAuthUserWithPermissions;
  let featureRepo: FeatureRepository;
  let strategyRepo: StrategyRepository;
  let featureToggleRepo: FeatureToggleRepository;
  let logger: ILogger;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  it('return true if feature is enabled at System level', async () => {
    const isEnabled = systemStrategyProvider.value();
    const result = await isEnabled();
    expect(result).to.be.eql(true);
  });

  function setUp() {
    metadataGetterStub = sinon.stub().resolves({
      featureKey: 'test',
      strategies: [StrategyBindings.SYSTEM_STRATEGY],
    });
    user = {
      permissions: ['*'],
      authClientId: 123,
      role: 'test_role',
      firstName: 'test_first_name',
      lastName: 'test_last_name',
      username: 'test_username',
    };
    featureRepo = createStubInstance(FeatureRepository);
    strategyRepo = createStubInstance(StrategyRepository);
    featureToggleRepo = createStubInstance(FeatureToggleRepository);
    logger = {
      log(info: LogMessage): void {},
      info(msg: string, key?: string): void {},
      warn(msg: string, key?: string): void {},
      error(msg: string, key?: string): void {},
      debug(msg: string, key?: string): void {},
    };

    strategyHelperService = new StrategyHelperService(
      metadataGetterStub,
      user,
      featureRepo,
      featureToggleRepo,
      strategyRepo,
      logger,
    );
    systemStrategyProvider = new SystemStrategyProvider(strategyHelperService);
  }
});
