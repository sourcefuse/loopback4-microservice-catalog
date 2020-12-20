import {expect, Client} from '@loopback/testlab';
import {setupApplication} from './test-helper';
import {AuthMultitenantExampleApplication} from '../..';

describe('API header tests', () => {
  let app = new AuthMultitenantExampleApplication();
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  describe('GET /ping', () => {
    it(`returns headers with custom 'x-frame-options' option`, async () => {
      const res = await client.get('/ping').expect(200);
      expect(res.headers['x-frame-options']).to.equal(
        process.env.X_FRAME_OPTIONS,
      );
    });

    it(`verifies rate limiter configuration`, async () => {
      const res = await client.get('/ping').expect(200);
      expect(res.headers['x-ratelimit-limit']).to.equal(
        process.env.RATE_LIMITER_MAX_REQS,
      );
    });
  });
});
