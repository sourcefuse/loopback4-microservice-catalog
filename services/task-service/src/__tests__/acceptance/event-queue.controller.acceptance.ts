import {Client, expect} from '@loopback/testlab';
import {setupApplication} from '../helper';
import {TaskServiceApplication} from '../../application';

describe('EventQueueController', () => {
  let app: TaskServiceApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.post('/event-queue/enqueue').expect(401);
    expect(response).to.have.property('error');
  });
});
