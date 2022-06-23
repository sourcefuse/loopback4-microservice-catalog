import {
  expect,
  createStubInstance,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {StrategyHelperService} from '../../services';
import sinon from 'sinon';
import {IAuthUserWithPermissions, ILogger} from '@sourceloop/core';
import {
  FeatureRepository,
  FeatureToggleRepository,
  StrategyRepository,
} from '../../repositories';
import {Getter} from '@loopback/core';
import {FeatureFlagMetadata} from '../../types';
import {LogMessage} from '@sourceloop/core/dist/components/logger-extension/types';
import {StrategyKey} from '../../enums';
import {Feature, FeatureToggle} from '../../models';
import {Filter} from '@loopback/repository';

describe('Strategy helper service', () => {
  let strategyHelperService: StrategyHelperService;
  let metadataGetterStub: Getter<FeatureFlagMetadata>;
  let user: IAuthUserWithPermissions;
  let featureRepo: StubbedInstanceWithSinonAccessor<FeatureRepository>;
  let strategyRepo: StubbedInstanceWithSinonAccessor<StrategyRepository>;
  let featureToggleRepo: StubbedInstanceWithSinonAccessor<FeatureToggleRepository>;
  let logger: ILogger;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('System Strategy', () => {
    const feature = new Feature({
      id: 'test_id',
      key: 'test',
    });
    const featureFilter: Filter<Feature> = {
      where: {
        key: feature.key,
      },
    };

    const featureToggle = new FeatureToggle({
      status: false,
    });
    const featureToggleFilter: Filter<FeatureToggle> = {
      where: {
        featureKey: feature.key,
        strategyKey: StrategyKey.System,
        strategyEntityId: feature.id,
      },
    };

    it('return true if Feature Toggle is not set for System Strategy', async () => {
      const findFeature = featureRepo.stubs.findOne;
      findFeature.resolves(feature);

      const findFeatureToggle = featureToggleRepo.stubs.findOne;
      findFeatureToggle.resolves(undefined);

      const result = await strategyHelperService.isFeatureEnabled(
        StrategyKey.System,
      );
      expect(result).to.be.eql(true);
      sinon.assert.calledOnce(findFeature);
      sinon.assert.calledWith(findFeature, featureFilter);
      sinon.assert.calledOnce(findFeatureToggle);
      sinon.assert.calledWith(findFeatureToggle, featureToggleFilter);
    });

    it('return false if Feature Toggle Status is false for System Strategy', async () => {
      const findFeature = featureRepo.stubs.findOne;
      findFeature.resolves(feature);

      const findFeatureToggle = featureToggleRepo.stubs.findOne;
      findFeatureToggle.resolves(featureToggle);

      const result = await strategyHelperService.isFeatureEnabled(
        StrategyKey.System,
      );
      expect(result).to.be.eql(false);
      sinon.assert.calledOnce(findFeature);
      sinon.assert.calledWith(findFeature, featureFilter);
      sinon.assert.calledOnce(findFeatureToggle);
      sinon.assert.calledWith(findFeatureToggle, featureToggleFilter);
    });
  });

  describe('Tenant Strategy', () => {
    const featureToggle = new FeatureToggle({
      status: false,
    });
    const featureToggleFilter: Filter<FeatureToggle> = {
      where: {
        featureKey: 'test',
        strategyKey: StrategyKey.Tenant,
        strategyEntityId: 'tenant_id',
      },
    };

    it('return true if Feature Toggle is not set for Tenant Strategy', async () => {
      const findFeatureToggle = featureToggleRepo.stubs.findOne;
      findFeatureToggle.resolves(undefined);

      const result = await strategyHelperService.isFeatureEnabled(
        StrategyKey.Tenant,
      );
      expect(result).to.be.eql(true);
      sinon.assert.calledOnce(findFeatureToggle);
      sinon.assert.calledWith(findFeatureToggle, featureToggleFilter);
    });

    it('return false if Feature Toggle Status is false for Tenant Strategy', async () => {
      const findFeatureToggle = featureToggleRepo.stubs.findOne;
      findFeatureToggle.resolves(featureToggle);

      const result = await strategyHelperService.isFeatureEnabled(
        StrategyKey.Tenant,
      );
      expect(result).to.be.eql(false);
      sinon.assert.calledOnce(findFeatureToggle);
      sinon.assert.calledWith(findFeatureToggle, featureToggleFilter);
    });
  });

  describe('User Strategy', () => {
    const featureToggle = new FeatureToggle({
      status: false,
    });
    const featureToggleFilter: Filter<FeatureToggle> = {
      where: {
        featureKey: 'test',
        strategyKey: StrategyKey.User,
        strategyEntityId: 'user_tenant_id',
      },
    };

    it('return true if Feature Toggle is not set for User Strategy', async () => {
      const findFeatureToggle = featureToggleRepo.stubs.findOne;
      findFeatureToggle.resolves(undefined);

      const result = await strategyHelperService.isFeatureEnabled(
        StrategyKey.User,
      );
      expect(result).to.be.eql(true);
      sinon.assert.calledOnce(findFeatureToggle);
      sinon.assert.calledWith(findFeatureToggle, featureToggleFilter);
    });

    it('return false if Feature Toggle Status is false for User Strategy', async () => {
      const findFeatureToggle = featureToggleRepo.stubs.findOne;
      findFeatureToggle.resolves(featureToggle);

      const result = await strategyHelperService.isFeatureEnabled(
        StrategyKey.User,
      );
      expect(result).to.be.eql(false);
      sinon.assert.calledOnce(findFeatureToggle);
      sinon.assert.calledWith(findFeatureToggle, featureToggleFilter);
    });
  });

  // Setup
  function setUp() {
    metadataGetterStub = sinon.stub().resolves({
      featureKey: 'test',
    });
    // sonarignore:start
    user = <IAuthUserWithPermissions>{
      // sonarignore:end
      permissions: ['*'],
      authClientId: 123,
      role: 'test_role',
      firstName: 'test_first_name',
      lastName: 'test_last_name',
      username: 'test_username',
      userTenantId: 'user_tenant_id',
      tenantId: 'tenant_id',
    };
    featureRepo = createStubInstance(FeatureRepository);
    strategyRepo = createStubInstance(StrategyRepository);
    featureToggleRepo = createStubInstance(FeatureToggleRepository);
    logger = {
      log(info: LogMessage): void {},
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
  }
});
