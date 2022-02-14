import {initialize} from 'unleash-client';
import {UserFeatureProvider} from '../../providers';
import {expect} from '@loopback/testlab';
import {IAuthUserWithPermissions} from '@sourceloop/core';

describe('User feature provider', () => {
  it('returns boolean if feature is enabled', () => {
    //connecting to the demo unleash for testing
    const unleashConst = initialize({
      url: 'https://app.unleash-hosted.com/demo/api/',
      appName: 'my-node-name',
      environment: 'development',
      customHeaders: {
        Authorization: '56907a2fa53c1d16101d509a10b78e36190b0f918d9f122d',
      },
    });
    const user: IAuthUserWithPermissions = {
      role: '1',
      firstName: 'admin',
      lastName: 'surname',
      username: 'admin@example.com',
      authClientId: 123,
      permissions: ['read', 'write'],
    };
    const userFeature = new UserFeatureProvider(unleashConst, user).value(); //feature toggle based on username
    const result = userFeature();
    expect(result).which.eql(false);
  });
});
