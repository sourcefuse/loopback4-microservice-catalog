import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {
  Group, Message, Thread
} from '../../models';
import {
  AttachmentRepository,
  GroupRepository,
  MessageRepository,
  ThreadRepository
} from '../../repositories';
import {InMailApplication} from '../application';
import {setUpApplication} from './helper';

describe('Originator Controller', () => {
  let app: InMailApplication;
  let client: Client;
  let attachmentRepo: AttachmentRepository;
  let groupRepo: GroupRepository;
  let messageRepo: MessageRepository;
  let threadRepo: ThreadRepository;
  const pass = 'test_password';
  const testUser = {
    id: 1,
    username: 'test_user',
    password: pass,
    permissions: [
      'ComposeMail',
      'UpdateMail',
      'ReplyMail',
      'AddAttachments',
      'GetThreads',
      'GetThread',
      'GetInMails',
      'GetInMail',
      'TrashMail',
      'RestoreMail',
      'GetInMailAttachments',
      'GetMetadata',
      'DeleteAttachment'
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

  it('gives status 422 when data sent is incorrect', async () => {
    const reqData = {

    };
    const response = await client
      .post(`/mails`)
      .send(reqData)
      .expect(422);

    expect(response).to.have.property('error');
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(`/mails`).expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(`/mails`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when workingHour details are not correct', async () => {
    const reqToaddData = await addData();

    await client
      .post(`/mails`)
      .set('authorization', `Bearer ${token}`)
      .send(reqToaddData)
      .expect(422);
  });

  it('gives status 200 and workingHour detail when workingHour is added', async () => {
    const reqToaddData = await addData();
    expect(reqToaddData.status).to.be.equal(200);

    const response = await client
      .get(`/mails/${reqToaddData.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    // expect(response.body).to.have.properties(['calendarId']);
    // expect(response.body.calendarId).to.be.equal('dummy');
  });

  it('updates workingHour successfully using PATCH request', async () => {
    const reqToaddData = await addData();

    const workingHourToUpdate = {
      calendarId: 'updatedId',
    };

    await client
      .patch(`/mails/${reqToaddData.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(workingHourToUpdate)
      .expect(204);

    const response = await client
      .get(`/mails/${reqToaddData.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    // expect(response.body).to.have.properties(['calendarId']);
    // expect(response.body.calendarId).to.be.equal('updatedId');
  });

  it('updates workingHour using PUT request', async () => {
    const reqToaddData = await addData();

    const workingHourToUpdate = {
      calendarId: 'updatedId',
    };

    await client
      .put(`/mails/${reqToaddData.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(workingHourToUpdate)
      .expect(204);

    const response = await client
      .get(`/mails/${reqToaddData.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    // expect(response.body).to.have.properties(['calendarId']);
    // expect(response.body.calendarId).to.be.equal('updatedId');
  });

  it('deletes a workingHour successfully', async () => {
    const reqToaddData = await addData();
    await client
      .del(`/mails/${reqToaddData.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  // it('should return count', async () => {
  //   await client
  //     .get(`/mails/count`)
  //     .set('authorization', `Bearer ${token}`)
  //     .expect(200);
  // });

  async function addData() {
    const thread = new Thread({
      id: 'random-thread-id',
      messageCounts: 4,
      subject: 'Sample Subject',
      groups: [
        new Group({
          id: 'random-group-id',
          party: 'sample-party@example.com',
          messageId: 'sample-message-id',
          threadId: 'sample-thread-id',
        }),
      ],
    });

    const a = new Message({
      id: 'random-msg-id',
      sender: 'tush',
      subject: 'tush',
      body: 'random-body',
      status: 'random-status',

    });

    return client
      .post(`/mails`)
      .set('authorization', `Bearer ${token}`)
      .send(thread).send(a);
  }

  async function deleteMockData() {
    await attachmentRepo.deleteAllHard();
    await groupRepo.deleteAllHard();
    await messageRepo.deleteAllHard();
    await threadRepo.deleteAllHard();
  }

  async function givenRepositories() {
    attachmentRepo = await app.getRepository(AttachmentRepository);
    groupRepo = await app.getRepository(GroupRepository);
    messageRepo = await app.getRepository(MessageRepository);
    threadRepo = await app.getRepository(ThreadRepository);
  }
});
