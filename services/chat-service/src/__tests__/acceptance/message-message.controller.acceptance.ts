import {Client, expect} from '@loopback/testlab';
import {MessageRepository} from '../../repositories';
import {ChatApplication} from '../application';
import {setUpApplication} from './helper';

describe('Message-Message Controller', () => {
  let app: ChatApplication;
  let client: Client;
  let messageRepo: MessageRepository;
  const basePath = '/messages/{id}/messages';

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

  async function deleteMockData() {
    await messageRepo.deleteAllHard();
  }

  async function givenRepositories() {
    messageRepo = await app.getRepository(MessageRepository);
  }
});
