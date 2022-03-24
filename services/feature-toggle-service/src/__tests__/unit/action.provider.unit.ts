import {Getter} from '@loopback/core';
import {Client, expect} from '@loopback/testlab';
import sinon from 'sinon';
import {StrategyBindings} from '../../keys';
import {FeatureFlagActionProvider} from '../../providers';
import {FeatureFlagMetadata} from '../../types';
import {TestingApplication} from '../fixtures/application';
import {setupApplication} from '../fixtures/test-helper';

describe('Feature flag action provider', () => {
  let app: TestingApplication;
  let metadataGetterStub: Getter<FeatureFlagMetadata>;
  let client: Client; //NOSONAR

  before('setupApplication', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({app, client} = await setupApplication());
  });
  after(async () => app.stop());

  it('return true if no strategies are passed (bypass all strategies)', async () => {
    metadataGetterStub = sinon.stub().resolves({
      feature: 'test',
      strategies: ['*'],
    });

    const action = new FeatureFlagActionProvider(
      metadataGetterStub,
      app,
    ).value();
    const result = await action();
    expect(result).to.be.eql(true);
  });

  it('returns a promise when action completed (if a strategy is passed)', async () => {
    metadataGetterStub = sinon.stub().resolves({
      feature: 'test',
      strategies: [StrategyBindings.SYSTEM_STRATEGY],
    });

    const action = new FeatureFlagActionProvider(
      metadataGetterStub,
      app,
    ).value();
    const result = action();
    expect(result).to.be.Promise();
  });
});
