import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {MessageRecipientRepository} from '../../repositories';
import {ChatApplication} from '../application';
import {setUpApplication} from './helper';

describe('Message-Recipient Message Controller', () => {
  let app: ChatApplication;
  let client: Client;
  let messageRecipientRepo: MessageRecipientRepository;
  const basePath = '/message-recipients/{id}/message';
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

  it('gives status 403 when token is passed and message id not present', async () => {
    await client
      .get(basePath)
      .set('authorization', `Bearer ${token}`)
      .expect(403);
  });

  async function deleteMockData() {
    await messageRecipientRepo.deleteAllHard();
  }

  async function givenRepositories() {
    messageRecipientRepo = await app.getRepository(MessageRecipientRepository);
  }
});
