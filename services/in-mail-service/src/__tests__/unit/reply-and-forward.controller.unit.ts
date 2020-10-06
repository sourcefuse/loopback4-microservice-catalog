import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {ReplyAndForwardController} from '../../controllers';
import {
  AttachmentRepository,
  GroupRepository,
  MessageRepository,
  ThreadRepository,
} from '../../repositories';
import {getSampleMailData, user} from './sample-data';
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
  });
});
