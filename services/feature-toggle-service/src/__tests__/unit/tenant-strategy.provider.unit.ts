import {TenantStrategyProvider} from '../../providers';
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

describe('Tenant Strategy provider', () => {
  let tenantStrategyProvider: TenantStrategyProvider;
  let strategyHelperService: StrategyHelperService;
  let metadataGetterStub: Getter<FeatureFlagMetadata>;
  let user: IAuthUserWithPermissions;
  let featureRepo: FeatureRepository;
  let strategyRepo: StrategyRepository;
  let featureToggleRepo: FeatureToggleRepository;
  let logger: ILogger;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  it('return true if feature is enabled at Tenant level', async () => {
    const isEnabled = tenantStrategyProvider.value();
    const result = await isEnabled();
    expect(result).to.be.eql(true);
  });

  function setUp() {
    metadataGetterStub = sinon.stub().resolves({
      featureKey: 'test',
      strategies: [StrategyBindings.TENANT_STRATEGY],
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
      log(info: LogMessage): void {}, //NOSONAR
      info(msg: string, key?: string): void {}, //NOSONAR
      warn(msg: string, key?: string): void {}, //NOSONAR
      error(msg: string, key?: string): void {}, //NOSONAR
      debug(msg: string, key?: string): void {}, //NOSONAR
    };

    strategyHelperService = new StrategyHelperService(
      metadataGetterStub,
      user,
      featureRepo,
      featureToggleRepo,
      strategyRepo,
      logger,
    );
    tenantStrategyProvider = new TenantStrategyProvider(strategyHelperService);
  }
});
