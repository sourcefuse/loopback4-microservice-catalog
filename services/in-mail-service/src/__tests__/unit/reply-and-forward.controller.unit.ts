import {
  createStubInstance,
  expect,
  sinon, StubbedInstanceWithSinonAccessor
} from '@loopback/testlab';
import {ReplyAndForwardController} from '../../controllers';
import {
  AttachmentRepository, GroupRepository, MessageRepository,
  ThreadRepository
} from '../../repositories';
import {
  getSampleMailData, group,
  message,
  transactionStub,
  user
} from './sample-data';
const sampleMessageId = 'sample-message-id';
const sampleThreadId = 'sample-thread-id';
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
    it('Replies to a sender', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const messageCreateStub = messageRepository.stubs.createRelational;
      messageCreateStub.resolves(message);
      const beginTransactionStub = messageRepository.stubs.beginTransaction;
      beginTransactionStub.resolves(transactionStub);
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([group]);
      const groupCreateStub = groupRepository.stubs.create;
      groupCreateStub.resolves(group);
      const controllerResult = await replyController.replyMail(
        sampleThreadId,
        sampleMessageId,
        false,
        getSampleMailData,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('userIds').which.is.an.Array;
      sinon.assert.calledOnce(messageFindOneStub);
      sinon.assert.calledOnce(messageCreateStub);
      sinon.assert.calledOnce(beginTransactionStub);
      sinon.assert.calledOnce(groupFindStub);
      sinon.assert.calledTwice(groupCreateStub);
    });
    it('Replies to everyone', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const messageCreateStub = messageRepository.stubs.createRelational;
      messageCreateStub.resolves(message);
      const beginTransactionStub = messageRepository.stubs.beginTransaction;
      beginTransactionStub.resolves(transactionStub);
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([group]);
      const groupCreateStub = groupRepository.stubs.create;
      groupCreateStub.resolves(group);
      const controllerResult = await replyController.replyMail(
        sampleThreadId,
        sampleMessageId,
        true,
        getSampleMailData,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('userIds').which.is.an.Array;
      sinon.assert.calledOnce(messageFindOneStub);
      sinon.assert.calledOnce(messageCreateStub);
      sinon.assert.calledOnce(beginTransactionStub);
      sinon.assert.calledOnce(groupFindStub);
      sinon.assert.calledTwice(groupCreateStub);
    });
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
    it('Throws an error if receiver is not found', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const beginTransactionStub = messageRepository.stubs.beginTransaction;
      beginTransactionStub.resolves(transactionStub);
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([]);
      const controllerResult = await replyController
        .replyMail(sampleThreadId, sampleMessageId, false, getSampleMailData)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
      sinon.assert.calledOnce(messageFindOneStub);
      sinon.assert.calledOnce(beginTransactionStub);
      sinon.assert.calledOnce(groupFindStub);
    });
  });
});


