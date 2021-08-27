import {Client, expect} from '@loopback/testlab';
import {OtpRepository} from '../../repositories';
import {TestingApplication} from '../fixtures/application';
import {setupApplication} from './test-helper';

describe('OTP Controller', () => {
  let app: TestingApplication;
  let client: Client;
  let otpRepo: OtpRepository;
  const basePath = '/otp-caches';

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  afterEach(deleteMockData);

  it('gives status 200 when otp is added', async () => {
    const reqToAddEntity = await addEntity();
    expect(reqToAddEntity.status).to.be.equal(204);

    const response = await client.get(`${basePath}/${reqToAddEntity.body.id}`);

    expect(response.status).to.be.equal(200);
  });

  it('deletes an otp successfully', async () => {
    const reqToAddEntity = await addEntity();
    await client.del(`${basePath}/${reqToAddEntity.body.id}`).expect(204);
  });

  async function addEntity() {
    const enitityToAdd = {
      otp: 'test_otp',
      username: 'test_username',
    };

    return client.post(basePath).send(enitityToAdd);
  }

  async function deleteMockData() {
    await otpRepo.deleteAll();
  }

  async function givenRepositories() {
    otpRepo = await app.getRepository(OtpRepository);
  }
});
