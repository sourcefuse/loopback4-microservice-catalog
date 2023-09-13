import {Client, expect} from '@loopback/testlab';
import {AuthenticationServiceApplication} from '../..';
import {STATUS_CODE} from '../../enums/status-codes.enum';
import {setupApplication} from './test-helper';

describe('PingController', () => {
  let app: AuthenticationServiceApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/ping?msg=world').expect(STATUS_CODE.OK);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });
});
