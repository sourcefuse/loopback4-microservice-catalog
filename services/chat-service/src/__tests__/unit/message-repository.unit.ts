import {expect} from '@loopback/testlab';
import {setUpApplication} from '../acceptance/helper';
import {ChatApplication} from '../application';
import {MessageRepository} from '../../repositories';
describe('supports @has many', () => {
  let app: ChatApplication;
  let messageRepo: MessageRepository;
  const messageObj = {
    body: 'Test message',
    channelId: 'test channel',
    channelType: 'testchannel type',
  };
  before('setupApplication', async () => {
    ({app} = await setUpApplication());
  });
  after(async () => {
    await app.stop();
  });
  before(givenRepositories);
  afterEach(deleteMockData);
  it('fetch messages with associated message file', async () => {
    const message = await messageRepo.create(messageObj);
    const file1 = await messageRepo.attachmentFiles(message.id).create({
      fileKey: 'test_file1.txt',
    });
    const file2 = await messageRepo.attachmentFiles(message.id).create({
      fileKey: 'test_file2.txt',
    });
    const filter = {
      where: {id: message.id},
      include: [{relation: 'attachmentFiles'}],
    };
    const messagesWithFiles = await messageRepo.find(filter);
    const messageFiles = messagesWithFiles[0].attachmentFiles;
    expect(messagesWithFiles[0].id).to.equal(message.id);
    expect(messageFiles[0].fileKey).to.equal(file1.fileKey);
    expect(messageFiles[1].fileKey).to.equal(file2.fileKey);
  });
  async function givenRepositories() {
    messageRepo = await app.getRepository(MessageRepository);
  }
  async function deleteMockData() {
    await messageRepo.deleteAllHard();
  }
});
