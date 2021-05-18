import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {MessageRepository} from '../../repositories';
import {ChatApplication} from '../application';
import {setUpApplication} from './helper';

describe('Message Controller', () => {
  let app: ChatApplication;
  let client: Client;
  let messageRepo: MessageRepository;
  const basePath = '/messages';
  const pass = 'test_password';
  const testUser = {
    id: 1,
    username: 'test_user',
    password: pass,
    permissions: [
      'ViewMessage',
      'CreateMessage',
      'UpdateMessage',
      'DeleteMessage',
    ],
  };

  const token = jwt.sign(testUser, 'kdskssdkdfs', {
    expiresIn: 180000,
    issuer: 'sf',
  });

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  afterEach(deleteMockData);

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(basePath)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 200 and an array of messages', async () => {
    const reqToAddMessage = await addMessage();
    expect(reqToAddMessage.status).to.be.equal(200);

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body[0]).to.have.properties(['body']);
    expect(response.body[0].body).to.be.equal('test_body');
  });

  it('updates message successfully using PATCH request', async () => {
    const reqToAddMessage = await addMessage();

    const messageToUpdate = {
      body: 'updated_body',
    };

    await client
      .patch(`${basePath}/${reqToAddMessage.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(messageToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${reqToAddMessage.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['body']);
    expect(response.body.body).to.be.equal('updated_body');
  });

  it('updates message successfully using PUT request', async () => {
    const reqToAddMessage = await addMessage();

    const messageToUpdate = {
      deletedBy: 'updated_delete',
      createdBy: 'updated_create',
      modifiedBy: 'updated_modify',
      body: 'updated_body',
      channelId: 'updated_channel',
      channelType: 'updated_channel_type',
      subject: 'updated_subject',
    };

    await client
      .put(`${basePath}/${reqToAddMessage.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(messageToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${reqToAddMessage.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['body']);
    expect(response.body.body).to.be.equal('updated_body');
  });

  it('deletes a message successfully', async () => {
    const reqToAddMessage = await addMessage();
    await client
      .del(`${basePath}/${reqToAddMessage.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addMessage() {
    const messageToAdd = {
      deletedBy: 'test_delete',
      createdBy: 'test_create',
      modifiedBy: 'test_modify',
      body: 'test_body',
      channelId: 'test_channel',
      channelType: 'test_channel_type',
      subject: 'test_subject',
    };

    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(messageToAdd);
  }

  async function deleteMockData() {
    await messageRepo.deleteAllHard();
  }

  async function givenRepositories() {
    messageRepo = await app.getRepository(MessageRepository);
  }
});
