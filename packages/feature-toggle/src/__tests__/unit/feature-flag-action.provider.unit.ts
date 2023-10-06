// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import {FeatureFlagActionProvider} from '../../providers';
import {FeatureFlagMetadata, IAuthUserWithDisabledFeat} from '../../types';

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

  it('should return false if one of the two featureKey exists in disabledFeatures, AND strategy', async () => {
    const MetadataWithAnd: FeatureFlagMetadata = {
      featureKey: ['1', '2'],
      options: {
        operator: 'AND',
      },
    };
    const metadataStub = sinon.stub().resolves(MetadataWithAnd);
    currUser.disabledFeatures = ['1'];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.false();
  });

  it('should return false if all the two featureKey exists in disabledFeatures, AND strategy', async () => {
    const MetadataWithAnd: FeatureFlagMetadata = {
      featureKey: ['1', '2'],
      options: {
        operator: 'AND',
      },
    };
    const metadataStub = sinon.stub().resolves(MetadataWithAnd);
    currUser.disabledFeatures = ['1', '2'];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.false();
  });

  it('should return true if none of the two featureKey exists in disabledFeatures, AND strategy', async () => {
    const MetadataWithAnd: FeatureFlagMetadata = {
      featureKey: ['1', '2'],
      options: {
        operator: 'AND',
      },
    };
    const metadataStub = sinon.stub().resolves(MetadataWithAnd);
    currUser.disabledFeatures = [];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.true();
  });

  it('should return true if one of the two features exists in disabledFeatures, OR strategy', async () => {
    const MetadataWithOr: FeatureFlagMetadata = {
      featureKey: ['1', '2'],
      options: {
        operator: 'OR',
      },
    };
    const metadataStub = sinon.stub().resolves(MetadataWithOr);
    currUser.disabledFeatures = ['1'];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.true();
  });

  it('should return false only if both the features exists in disabledFeatures, OR strategy', async () => {
    const MetadataWithOr: FeatureFlagMetadata = {
      featureKey: ['1', '2'],
      options: {
        operator: 'OR',
      },
    };
    const metadataStub = sinon.stub().resolves(MetadataWithOr);
    currUser.disabledFeatures = ['1', '2'];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.false();
  });

  it('should return false if single feature is passed in decorator with OR strategy and that feature is disabled', async () => {
    const MetadataWithOr: FeatureFlagMetadata = {
      featureKey: '1',
      options: {
        operator: 'OR',
      },
    };
    const metadataStub = sinon.stub().resolves(MetadataWithOr);
    currUser.disabledFeatures = ['1'];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.false();
  });

  it('should return true if single feature is passed in decorator with OR strategy and that feature is not disabled', async () => {
    const MetadataWithOr: FeatureFlagMetadata = {
      featureKey: '1',
      options: {
        operator: 'OR',
      },
    };
    const metadataStub = sinon.stub().resolves(MetadataWithOr);
    currUser.disabledFeatures = ['2'];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.true();
  });

  it('should return false if single feature is passed in decorator with AND strategy and feature is disabled', async () => {
    const MetadataWithOr: FeatureFlagMetadata = {
      featureKey: '1',
      options: {
        operator: 'AND',
      },
    };
    const metadataStub = sinon.stub().resolves(MetadataWithOr);
    currUser.disabledFeatures = ['1'];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.false();
  });

  it('should return true if single feature is passed in decorator with AND strategy and feature is not disabled', async () => {
    const MetadataWithOr: FeatureFlagMetadata = {
      featureKey: '1',
      options: {
        operator: 'AND',
      },
    };
    const metadataStub = sinon.stub().resolves(MetadataWithOr);
    currUser.disabledFeatures = [];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.true();
  });

  it('returns true when no strategy is provided in the decorator, by default OR is used', async () => {
    const MetadataWithOr: FeatureFlagMetadata = {
      featureKey: ['1', '2'],
    };
    const metadataStub = sinon.stub().resolves(MetadataWithOr);
    currUser.disabledFeatures = ['1'];
    const action = new FeatureFlagActionProvider(
      metadataStub,
      currUser,
    ).value();
    const result = await action();
    expect(result).to.be.true();
  });
});
