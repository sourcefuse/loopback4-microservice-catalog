import {RestApplication} from '@loopback/rest';
import {Client, expect, sinon} from '@loopback/testlab';
import {StateTracking} from '../../models';
import {StateTrackingRepository} from '../../repositories';
import {setUpApplication} from './helper';

describe('StateTrackingController', () => {
  let app: RestApplication;
  let client: Client;
  let stateTrackingRepo: StateTrackingRepository;
  let sandbox: sinon.SinonSandbox;

  before(async () => {
    ({app, client} = await setUpApplication());
    await givenRepositories();
    stateTrackingRepo = await app.get('repositories.StateTrackingRepository');
    sandbox = sinon.createSandbox();
  });

  beforeEach(async () => {
    await createStateTrackingMockData();
  });

  afterEach(() => sandbox.restore());
  after(async () => {
    await app.stop();
  });

  it('finds the latest record of a given type', async () => {
    const recordType = 'exampleType';
    await client
      .get(`/state-tracking/latest/${recordType}`)
      .expect(200)
      .then(res => {
        expect(res.body.recordType).to.equal(recordType);
      });
  });

  it('handles not found for latest record', async () => {
    await client.get(`/state-tracking/latest/nonexistentType`).expect(404);
  });

  it('finds all records of a given type', async () => {
    const recordType = 'exampleType';
    await client
      .get(`/state-tracking/all/${recordType}`)
      .expect(200)
      .then(res => {
        expect(res.body).to.be.Array();
      });
  });

  it('counts records of a given type', async () => {
    const recordType = 'exampleType';
    await client
      .get(`/state-tracking/count/${recordType}`)
      .expect(200)
      .then(res => {
        expect(res.body.count).to.be.Number();
      });
  });

  async function createStateTrackingMockData() {
    const mockStateTrackingData: Partial<StateTracking> = {
      state: 'exampleState',
      recordType: 'exampleType',
      timestamp: new Date(),
      recordId: 'exampleId',
      payload: JSON.stringify({test: 'test'}),
    };
    await stateTrackingRepo.create(new StateTracking(mockStateTrackingData));
  }

  async function givenRepositories() {
    app
      .bind('repositories.StateTrackingRepository')
      .toClass(StateTrackingRepository);
  }
});
