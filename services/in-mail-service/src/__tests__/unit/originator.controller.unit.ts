// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {OriginatorController} from '../../controllers';
import {IdArrays, Message, StatusMarker} from '../../models';
import {
  AttachmentRepository,
  GroupRepository,
  MessageRepository,
  ThreadRepository,
} from '../../repositories';
import {PartyTypeMarker, StorageMarker, VisibilityMarker} from '../../types';
import {
  getSampleDataWithOutGroup,
  getSampleMailData,
  group,
  message,
  messageIds,
  thread,
  transactionStub,
  user,
  attachment,
} from './sample-data';
const sampleMessageId = 'sample-message-id';
const sampleExtId = 'sample-ext-id';
const sampleMarkMail = 'read';
const sampleAttachmentId = 'sample-attachment-id';
const sampleIdArray = new IdArrays({
  messageIds: ['sample=message-id'],
  threadIds: ['sample-thread-id'],
});
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

  describe('PUT /mails/{messageId}', () => {
    it('throws error if attachment is not present in mail', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const transaction = messageRepository.stubs.beginTransaction;
      transaction.resolves(transactionStub);
      const mailStub = messageRepository.stubs.updateById;
      mailStub.resolves();
      const controllerResult = await controller
        .updateDraft(getSampleMailData, sampleMessageId)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
      sinon.assert.calledOnce(transaction);
    });

    it('throws error if mail is not present', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves();
      const mailStub = messageRepository.stubs.updateById;
      mailStub.resolves();
      const controllerResult = await controller
        .updateDraft(getSampleMailData, sampleMessageId)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });

    it('throws error if mail is not draft', async () => {
      setUpStub();
      const messageChange = message;
      messageChange.status = StatusMarker.send;
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(messageChange);
      const mailStub = messageRepository.stubs.updateById;
      mailStub.resolves();
      const controllerResult = await controller
        .updateDraft(getSampleMailData, sampleMessageId)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });
  });

  describe('POST /mails/{messageId}/attachments', () => {
    it('throws error if attachment is not present', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const mailStub = messageRepository.stubs.updateById;
      mailStub.resolves();
      const filter: Partial<Message> = {id: sampleMessageId};
      const attachmentArray = [attachment];
      const controllerResult = await controller
        .addAttachment({attachments: attachmentArray}, sampleMessageId, filter)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });

    it('throws error if message is not present', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves();
      const mailStub = messageRepository.stubs.updateById;
      mailStub.resolves();
      const filter: Partial<Message> = {id: sampleMessageId};
      const attachmentArray = [attachment];
      const controllerResult = await controller
        .addAttachment({attachments: attachmentArray}, sampleMessageId, filter)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });

    it('throws error if message status is not draft', async () => {
      setUpStub();
      const messageChange = message;
      messageChange.status = StatusMarker.send;
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(messageChange);
      const mailStub = messageRepository.stubs.updateById;
      mailStub.resolves();
      const filter: Partial<Message> = {id: sampleMessageId};
      const attachmentArray = [attachment];
      const controllerResult = await controller
        .addAttachment({attachments: attachmentArray}, sampleMessageId, filter)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });
  });

  describe('DELETE /mails/{messageId}/attachments/{attachmentId}', () => {
    it('throws error if attachment is not present while deleting', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const mailStub = messageRepository.stubs.updateById;
      mailStub.resolves();
      const filter: Partial<Message> = {id: sampleMessageId};
      const controllerResult = await controller
        .removeAttachment(sampleMessageId, sampleAttachmentId, filter)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });

    it('throws error if message is not present', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves();
      const mailStub = messageRepository.stubs.updateById;
      mailStub.resolves();
      const filter: Partial<Message> = {id: sampleMessageId};
      const controllerResult = await controller
        .removeAttachment(sampleMessageId, sampleAttachmentId, filter)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });

    it('throws error if message status is not draft', async () => {
      setUpStub();
      const messageChange = message;
      messageChange.status = StatusMarker.send;
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(messageChange);
      const mailStub = messageRepository.stubs.updateById;
      mailStub.resolves();
      const filter: Partial<Message> = {id: sampleMessageId};
      const controllerResult = await controller
        .removeAttachment(sampleMessageId, sampleAttachmentId, filter)
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
    it('throws error if storage is in draft', async () => {
      setUpStub();
      const groupFind = groupRepository.stubs.find;
      groupFind.resolves([group]);
      const groupUpdate = groupRepository.stubs.update;
      groupUpdate.resolves();
      const storage: StorageMarker = StorageMarker.draft;
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
    });
    it('throws error if storage is not trash or draft', async () => {
      setUpStub();
      const groupFind = groupRepository.stubs.find;
      groupFind.resolves([group]);
      const groupUpdate = groupRepository.stubs.update;
      groupUpdate.resolves();
      const storage: StorageMarker = StorageMarker.inbox;
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
    it('Throws error if group length is 0', async () => {
      setUpStub();
      const groupFind = groupRepository.stubs.find;
      groupFind.resolves([]);
      const controllerResult = await controller
        .restore({}, messageIds)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
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
    it('Sends a Drafted message with type changed', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const groupChange = group;
      groupChange.type = PartyTypeMarker.bcc;
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([groupChange]);
      const messageUpdateStub = messageRepository.stubs.updateById;
      messageUpdateStub.resolves();
      const groupUpdateStub = groupRepository.stubs.update;
      groupUpdateStub.resolves();
      const controllerResult = await controller.sendDraft(sampleMessageId, {
        extId: sampleExtId,
      });
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('id').which.is.a.String;
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
  describe('PATCH mails/marking/{markType}', () => {
    it('Sends true for read category', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([group]);
      const messageUpdateStub = messageRepository.stubs.updateById;
      messageUpdateStub.resolves();
      const groupUpdateStub = groupRepository.stubs.update;
      groupUpdateStub.resolves();
      const controllerResult = await controller.markMail(
        sampleMarkMail,
        sampleIdArray,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('success').which.is.a.Boolean;
    });
    it('Sends true for unread category', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([group]);
      const messageUpdateStub = messageRepository.stubs.updateById;
      messageUpdateStub.resolves();
      const groupUpdateStub = groupRepository.stubs.update;
      groupUpdateStub.resolves();
      const controllerResult = await controller.markMail(
        'unread',
        sampleIdArray,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('success').which.is.a.Boolean;
    });
    it('Sends true for important category', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([group]);
      const messageUpdateStub = messageRepository.stubs.updateById;
      messageUpdateStub.resolves();
      const groupUpdateStub = groupRepository.stubs.update;
      groupUpdateStub.resolves();
      const controllerResult = await controller.markMail(
        'important',
        sampleIdArray,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('success').which.is.a.Boolean;
    });
    it('Sends true for not-important category', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([group]);
      const messageUpdateStub = messageRepository.stubs.updateById;
      messageUpdateStub.resolves();
      const groupUpdateStub = groupRepository.stubs.update;
      groupUpdateStub.resolves();
      const controllerResult = await controller.markMail(
        'not-important',
        sampleIdArray,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('success').which.is.a.Boolean;
    });
    it('Throws an Error if a category is not found', async () => {
      setUpStub();
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([group]);
      const messageUpdateStub = messageRepository.stubs.updateById;
      messageUpdateStub.resolves();
      const groupUpdateStub = groupRepository.stubs.update;
      groupUpdateStub.resolves();
      const controllerResult = await controller
        .markMail(VisibilityMarker.new, sampleIdArray)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });
  });
});
