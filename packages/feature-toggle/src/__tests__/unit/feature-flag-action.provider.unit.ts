// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {FeatureFlagActionProvider} from '../../providers';
import {FeatureFlagMetadata, IAuthUserWithDisabledFeat} from '../../types';
import {expect, sinon} from '@loopback/testlab';

const metadata: FeatureFlagMetadata = {
  featureKey: '1',
};

const skipMetadata: FeatureFlagMetadata = {
  featureKey: '*',
};
const currUser: IAuthUserWithDisabledFeat = {
  disabledFeatures: [],
  permissions: ['View', 'Create'],
  role: 'ADMIN',
  firstName: 'admin',
  lastName: 'surname',
  username: 'admin.surname@abc.com',
  authClientId: 1,
};

describe('FeatureFlagActionProvider', () => {
  it('returns true when there are no disabled features', async () => {
    const metadataStub = sinon.stub().resolves(metadata);
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.true();
  });
  it('returns true when the disabled feature does not match', async () => {
    const metadataStub = sinon.stub().resolves(metadata);
    currUser.disabledFeatures = ['2'];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.true();
  });

  it('returns false when the disabled feature match', async () => {
    const metadataStub = sinon.stub().resolves(metadata);
    currUser.disabledFeatures = ['1'];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.false();
  });

  it('returns true when feature check is skipped', async () => {
    const metadataStub = sinon.stub().resolves(skipMetadata);
    currUser.disabledFeatures = ['1'];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.true();
  });
});
