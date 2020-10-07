import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {OriginatorController} from '../../controllers';
import {
  AttachmentRepository,
  GroupRepository,
  MessageRepository,
  ThreadRepository,
} from '../../repositories';
import {StorageMarker} from '../../types';
import {
  getSampleDataWithOutGroup,
  getSampleMailData,
  group,
  message,
  messageIds,
  thread,
  transactionStub,
  user,
} from './sample-data';
const sampleMessageId = 'sample-message-id';
const sampleExtId = 'sample-ext-id';
let messageRepository: StubbedInstanceWithSinonAccessor<MessageRepository>;
let threadRepository: StubbedInstanceWithSinonAccessor<ThreadRepository>;
let groupRepository: StubbedInstanceWithSinonAccessor<GroupRepository>;
let attachmentRepository: StubbedInstanceWithSinonAccessor<AttachmentRepository>;
let controller: OriginatorController;
const setUpStub = () => {
  messageRepository = createStubInstance(MessageRepository);
  threadRepository = createStubInstance(ThreadRepository);
  groupRepository = createStubInstance(GroupRepository);
  attachmentRepository = createStubInstance(AttachmentRepository);
  controller = new OriginatorController(
    messageRepository,
    threadRepository,
    groupRepository,
    attachmentRepository,
    user,
  );
};
describe('originatorcontroller(unit) as', () => {
  describe('POST /mails', () => {
    it('compose a mail with attachments and meta-data', async () => {
      setUpStub();
      const threadCreate = threadRepository.stubs.incrementOrCreate;
      threadCreate.resolves(thread);
      const transaction = messageRepository.stubs.beginTransaction;
      transaction.resolves(transactionStub);
      const mailStub = messageRepository.stubs.createRelational;
      mailStub.resolves(message);
      const controllerResult = await controller.composeMail(getSampleMailData);
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('id').which.is.a.String;
      sinon.assert.calledOnce(threadCreate);
      sinon.assert.calledOnce(transaction);
      sinon.assert.calledOnce(mailStub);
    });
    it("throws an error if there isn't any recipient", async () => {
      setUpStub();
      const controllerResult = await controller
        .composeMail(getSampleDataWithOutGroup)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });
  });
  describe('DELETE /mails/bulk/{storage}/{action}', () => {
    it('trashes mails of inbox', async () => {
      setUpStub();
      const groupFind = groupRepository.stubs.find;
      groupFind.resolves([group]);
      const groupUpdate = groupRepository.stubs.update;
      groupUpdate.resolves();
      const storage: StorageMarker = StorageMarker.inbox;
      const action = 'trash';
      const controllerResult = await controller.trashBulk(
        storage,
        action,
        {
          extId: sampleExtId,
        },
        messageIds,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('items').which.is.an.Array;
      sinon.assert.calledOnce(groupFind);
      sinon.assert.calledOnce(groupUpdate);
    });
    it('deletes mails of trash', async () => {
      setUpStub();
      const groupFind = groupRepository.stubs.find;
      groupFind.resolves([group]);
      const groupUpdate = groupRepository.stubs.update;
      groupUpdate.resolves();
      const storage: StorageMarker = StorageMarker.trash;
      const action = 'delete';
      const controllerResult = await controller.trashBulk(
        storage,
        action,
        {
          extId: sampleExtId,
        },
        messageIds,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('items').which.is.an.Array;
      sinon.assert.calledOnce(groupFind);
      sinon.assert.calledOnce(groupUpdate);
    });
    it('throws an error if an group is not found', async () => {
      setUpStub();
      const groupFind = groupRepository.stubs.find;
      groupFind.resolves([]);
      const storage: StorageMarker = StorageMarker.trash;
      const action = 'delete';
      const controllerResult = await controller
        .trashBulk(
          storage,
          action,
          {
            extId: sampleExtId,
          },
          messageIds,
        )
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
      sinon.assert.calledOnce(groupFind);
    });
    it('throws an error if we trash a mail which is already in trash', async () => {
      setUpStub();
      const groupFind = groupRepository.stubs.find;
      groupFind.resolves([group]);
      const storage: StorageMarker = StorageMarker.trash;
      const action = 'trash';
      const controllerResult = await controller
        .trashBulk(
          storage,
          action,
          {
            extId: sampleExtId,
          },
          messageIds,
        )
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
      sinon.assert.calledOnce(groupFind);
    });
  });
  describe('PATCH /mails/bulk/restore', () => {
    it('Restores mail from trash', async () => {
      setUpStub();
      const groupFind = groupRepository.stubs.find;
      groupFind.resolves([group]);
      const groupUpdate = groupRepository.stubs.update;
      groupUpdate.resolves();
      const controllerResult = await controller.restore({}, messageIds);
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).has.property('item').which.is.a.Object;
      sinon.assert.calledOnce(groupFind);
      sinon.assert.calledOnce(groupUpdate);
    });
    it('Throws an Error if a group is not found', async () => {
      setUpStub();
      const groupFind = groupRepository.stubs.find;
      groupFind.resolves();
      const controllerResult = await controller
        .restore({}, messageIds)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
      sinon.assert.calledOnce(groupFind);
    });
  });
  describe('PATCH mails/{messageId}/send', () => {
    it('Sends a Drafted message', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([group]);
      const messageUpdateStub = messageRepository.stubs.updateById;
      messageUpdateStub.resolves();
      const groupUpdateStub = groupRepository.stubs.update;
      groupUpdateStub.resolves();
      const controllerResult = await controller.sendDraft(sampleMessageId, {
        extId: sampleExtId,
      });
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('id').which.is.a.String;
      sinon.assert.calledOnce(messageUpdateStub);
      sinon.assert.calledOnce(groupFindStub);
      sinon.assert.calledOnce(messageUpdateStub);
      sinon.assert.calledOnce(groupUpdateStub);
    });
    it('Throws an Error if a message is not found', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves();
      const controllerError = await controller
        .sendDraft(sampleMessageId, {
          extId: sampleExtId,
        })
        .catch(error => error);
      expect(controllerError).instanceOf(Error);
      sinon.assert.calledOnce(messageFindOneStub);
    });
    it('Throws an Error if a group is not found', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const groupRepositoryStub = groupRepository.stubs.find;
      groupRepositoryStub.resolves();
      const controllerError = await controller
        .sendDraft(sampleMessageId, {
          extId: sampleExtId,
        })
        .catch(error => error);
      expect(controllerError).instanceOf(Error);
      sinon.assert.calledOnce(messageFindOneStub);
      sinon.assert.calledOnce(groupRepositoryStub);
    });
  });
});
