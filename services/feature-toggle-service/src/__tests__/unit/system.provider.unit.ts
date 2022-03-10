// import {initialize} from 'unleash-client';
// import {SystemFeatureProvider} from '../../providers';
// import {expect} from '@loopback/testlab';

// describe('System feature provider', () => {
//   it('returns boolean if feature is enabled', () => {
//     const unleashConst = initialize({
//       url: 'https://app.unleash-hosted.com/demo/api/',
//       appName: 'my-node-name',
//       environment: 'development',
//       customHeaders: {
//         Authorization: '56907a2fa53c1d16101d509a10b78e36190b0f918d9f122d',
//       },
//     });
//     const systemFeature = new SystemFeatureProvider(unleashConst).value();
//     const result = systemFeature();
//     expect(result).which.eql(false);
//   });
// });
