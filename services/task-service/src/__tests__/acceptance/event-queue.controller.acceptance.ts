import {Client} from '@loopback/testlab';
import {setupApplication} from '../helper';
import {TaskServiceApplication} from '../../application';
import {samplePayload} from '../data';

describe('EventQueueController', () => {
  let app: TaskServiceApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('enqueueEvent successfully', async () => {
    const eventPayload = {
      ...samplePayload,
    };

    await client
      .post('/event-queue/enqueue-event')
      .send(eventPayload)
      .expect(204); // No Content status
  });
});
