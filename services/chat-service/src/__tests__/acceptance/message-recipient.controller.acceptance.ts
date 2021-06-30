import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {MessageRecipientRepository} from '../../repositories';
import {ChatApplication} from '../application';
import {setUpApplication} from './helper';

describe('Message Recipient Controller', () => {
  let app: ChatApplication;
  let client: Client;
  let messageRecipientRepo: MessageRecipientRepository;
  const basePath = '/message-recipients';
  const pass = 'test_password';
  const testUser = {
    id: 1,
    username: 'test_user',
    password: pass,
    permissions: [
      'ViewMessageRecipient',
      'CreateMessageRecipient',
      'UpdateMessageRecipient',
      'DeleteMessageRecipient',
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

  it('gives status 200 and an array of message recipients', async () => {
    const reqToAddMessageRecipient = await addMessageRecipient();
    expect(reqToAddMessageRecipient.status).to.be.equal(200);

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body[0]).to.have.properties(['channelId']);
    expect(response.body[0].channelId).to.be.equal('test_channel');
  });

  it('updates message recipient successfully using PATCH request', async () => {
    const reqToAddMessageRecipient = await addMessageRecipient();

    const messageRecipientToUpdate = {
      channelId: 'updated_channel',
    };

    await client
      .patch(`${basePath}/${reqToAddMessageRecipient.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(messageRecipientToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${reqToAddMessageRecipient.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['channelId']);
    expect(response.body.channelId).to.be.equal('updated_channel');
  });

  it('updates message recipient successfully using PUT request', async () => {
    const reqToAddMessageRecipient = await addMessageRecipient();

    const messageRecipientToUpdate = {
      deletedBy: 'updated_delete',
      createdBy: 'updated_create',
      modifiedBy: 'updated_modify',
      channelId: 'updated_channel',
      forwardedBy: 'updated_forward',
      recipientId: 'updated_recipient',
      messageId: 'updated_messageId',
    };

    await client
      .put(`${basePath}/${reqToAddMessageRecipient.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(messageRecipientToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${reqToAddMessageRecipient.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['channelId']);
    expect(response.body.channelId).to.be.equal('updated_channel');
  });

  it('deletes a message recipient successfully', async () => {
    const reqToAddMessageRecipient = await addMessageRecipient();
    await client
      .del(`${basePath}/${reqToAddMessageRecipient.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addMessageRecipient() {
    const messageRecipientToAdd = {
      deletedBy: 'test_delete',
      createdBy: 'test_create',
      modifiedBy: 'test_modify',
      channelId: 'test_channel',
      forwardedBy: 'test_forward',
      recipientId: 'test_recipient',
      messageId: 'test_messageId',
    };

    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(messageRecipientToAdd);
  }

  async function deleteMockData() {
    await messageRecipientRepo.deleteAllHard();
  }

  async function givenRepositories() {
    messageRecipientRepo = await app.getRepository(MessageRecipientRepository);
  }
});
