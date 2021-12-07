import {Client, expect} from '@loopback/testlab';
import {StrategyBindings} from '../../keys';
import {FeatureFlagActionProvider} from '../../providers';
import {FeatureFlagMetadata} from '../../types';
import {TestingApplication} from '../fixtures/application';
import {setupApplication} from '../fixtures/test-helper';

describe('Feature flag action provider', () => {
  let app: TestingApplication;
  let client: Client; //NOSONAR

  before('setupApplication', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({app, client} = await setupApplication());
  });
  after(async () => app.stop());

  it('returns a promise when action completed', async () => {
    const metadata = () => {
      return app.get(StrategyBindings.METADATA) as Promise<FeatureFlagMetadata>;
    };

    const action = new FeatureFlagActionProvider(metadata, app).value();
    const result = action();
    await expect(result).to.be.fulfilled();
  });
});
