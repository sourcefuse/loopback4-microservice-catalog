// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Transaction} from '@loopback/repository';
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {ForwardMailBody} from '../..';
import {ReplyAndForwardController} from '../../controllers';
import {
  AttachmentRepository,
  GroupRepository,
  MessageRepository,
  ThreadRepository,
} from '../../repositories';
import {getSampleMailData, user, message, group, thread} from './sample-data';
const sampleMessageId = 'sample-message-id';
const sampleThreadId = 'sample-thread-id';
async function commit() {
  // This is intentional
}
async function rollback() {
  // This is intentional
}
function isActive() {
  return true;
}
const transaction: Transaction = {
  id: 'test_id',
  commit,
  rollback,
  isActive,
};
const forwardMailBody: ForwardMailBody = getSampleMailData;
let messageRepository: StubbedInstanceWithSinonAccessor<MessageRepository>;
let threadRepository: StubbedInstanceWithSinonAccessor<ThreadRepository>;
let groupRepository: StubbedInstanceWithSinonAccessor<GroupRepository>;
let attachmentRepository: StubbedInstanceWithSinonAccessor<AttachmentRepository>;
let replyController: ReplyAndForwardController;
const setUpStub = () => {
  messageRepository = createStubInstance(MessageRepository);
  threadRepository = createStubInstance(ThreadRepository);
  groupRepository = createStubInstance(GroupRepository);
  attachmentRepository = createStubInstance(AttachmentRepository);
  replyController = new ReplyAndForwardController(
    messageRepository,
    threadRepository,
    groupRepository,
    attachmentRepository,
    user,
  );
};
describe('replyController(unit) as', () => {
  describe('PATCH threads/{threadId}/mails/{messageId}/replies', () => {
    it('Throws an error if a message is not found', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves();
      const controllerResult = await replyController
        .replyMail(sampleThreadId, sampleMessageId, false, getSampleMailData)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
      sinon.assert.calledOnce(messageFindOneStub);
    });

    it('returns an object that contains userIds', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const messageTransactionStub = messageRepository.stubs.beginTransaction;
      messageTransactionStub.resolves(transaction);
      const messageCreateRelationalStub =
        messageRepository.stubs.createRelational;
      messageCreateRelationalStub.resolves(message);
      const groupFind = groupRepository.stubs.execute;
      groupFind.resolves([group]);
      const groupCreate = groupRepository.stubs.create;
      groupCreate.resolves(group);
      const controllerResult = await replyController
        .replyMail(sampleThreadId, sampleMessageId, false, getSampleMailData)
        .catch(error => error);
      expect(controllerResult).instanceOf(Object);
      sinon.assert.calledOnce(messageFindOneStub);
    });
  });

  describe('PATCH threads/{threadId}/forward', () => {
    it('Throws an error if a thread is not found', async () => {
      setUpStub();
      const controllerResult = await replyController
        .forward(forwardMailBody, sampleThreadId)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });

    it('Throws error if there is no group id present', async () => {
      setUpStub();
      const threadCreateMulti = threadRepository.stubs.findOne;
      threadCreateMulti.resolves(thread);
      const threadCreate = threadRepository.stubs.incrementOrCreate;
      threadCreate.resolves(thread);
      const messageFindOneStub = messageRepository.stubs.create;
      messageFindOneStub.resolves(message);
      const messageTransactionStub = messageRepository.stubs.beginTransaction;
      messageTransactionStub.resolves(transaction);
      const messageCreateRelationalStub =
        messageRepository.stubs.createRelational;
      messageCreateRelationalStub.resolves(message);
      const groupFind = groupRepository.stubs.execute;
      groupFind.resolves([group]);
      const groupCreate = groupRepository.stubs.create;
      groupCreate.resolves(group);
      const controllerResult = await replyController
        .forward(forwardMailBody, sampleThreadId)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });
  });
});
