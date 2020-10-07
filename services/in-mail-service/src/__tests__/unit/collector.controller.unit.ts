import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {CollectorController} from '../../controllers';
import {
  AttachmentRepository,
  GroupRepository,
  MessageRepository,
  MetaRepository,
  ThreadRepository,
} from '../../repositories';
import {StorageMarker} from '../../types';
import {group, message, thread, user} from './sample-data';
const groups = [group];
const sampleMessageId = 'sample-message-id';
const sampleThreadId = 'sample-thread-id';
const sampleExtId = 'sample-ext-id';
let messageRepository: StubbedInstanceWithSinonAccessor<MessageRepository>;
let threadRepository: StubbedInstanceWithSinonAccessor<ThreadRepository>;
let groupRepository: StubbedInstanceWithSinonAccessor<GroupRepository>;
let attachmentRepository: StubbedInstanceWithSinonAccessor<AttachmentRepository>;
let metaRepository: StubbedInstanceWithSinonAccessor<MetaRepository>;
let controller: CollectorController;
const setUpStub = () => {
  messageRepository = createStubInstance(MessageRepository);
  threadRepository = createStubInstance(ThreadRepository);
  groupRepository = createStubInstance(GroupRepository);
  attachmentRepository = createStubInstance(AttachmentRepository);
  metaRepository = createStubInstance(MetaRepository);
  controller = new CollectorController(
    messageRepository,
    metaRepository,
    groupRepository,
    threadRepository,
    attachmentRepository,
    user,
  );
};
describe('CollectorController (unit) as', () => {
  describe('GET collector/threads/{threadId}', () => {
    it('gets a thread', async () => {
      setUpStub();
      const groupCountStub = groupRepository.stubs.count;
      groupCountStub.resolves({
        count: 1,
      });
      const threadFindStub = threadRepository.stubs.findOne;
      threadFindStub.resolves(thread);
      const threadControllerResult = await controller.fetchThreadById(
        sampleThreadId,
        {
          extId: sampleExtId,
        },
      );
      // eslint-disable-next-line no-unused-expressions
      expect(threadControllerResult).to.have.a.property('items').which.is.an
        .Array;
      sinon.assert.calledOnce(threadFindStub);
    });
    it('throws an error if a group is not found', async () => {
      setUpStub();
      const groupCountStub = groupRepository.stubs.count;
      groupCountStub.resolves({
        count: 0,
      });
      const sampleError = await controller
        .fetchThreadById(sampleExtId, {
          extId: sampleExtId,
        })
        .catch(err => err);
      expect(sampleError).instanceof(Error);
      sinon.assert.calledOnce(groupCountStub);
    });
    it('throws an error if a thread is not found', async () => {
      setUpStub();
      const groupCountStub = groupRepository.stubs.count;
      groupCountStub.resolves({
        count: 1,
      });
      const threadFindStub = threadRepository.stubs.findOne;
      threadFindStub.resolves();
      const sampleError = await controller
        .fetchThreadById(sampleExtId, {
          extId: sampleExtId,
        })
        .catch(err => err);
      expect(sampleError).instanceof(Error);
      sinon.assert.calledOnce(groupCountStub);
      sinon.assert.calledOnce(threadFindStub);
    });
  });

  describe('GET collector/mails/{messageId}', () => {
    it('gets a message', async () => {
      setUpStub();
      const groupCountStub = groupRepository.stubs.count;
      groupCountStub.resolves({
        count: 1,
      });
      const messageRepositoryStub = messageRepository.stubs.findOne;
      messageRepositoryStub.resolves(message);
      const controllerResult = await controller.fetchById(sampleExtId, {
        extId: sampleExtId,
      });
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('item').which.is.an.Object;
      sinon.assert.calledOnce(messageRepositoryStub);
    });
    it('throws an error if an group is not found', async () => {
      setUpStub();
      const groupCountStub = groupRepository.stubs.count;
      groupCountStub.resolves({
        count: 0,
      });
      const sampleError = await controller
        .fetchById(sampleMessageId, {
          extId: sampleExtId,
        })
        .catch(error => error);
      expect(sampleError).instanceof(Error);
      sinon.assert.calledOnce(groupCountStub);
    });
    it('throws an error if a message is not found', async () => {
      setUpStub();
      const groupCountStub = groupRepository.stubs.count;
      groupCountStub.resolves({
        count: 1,
      });
      const messageRepositoryStub = messageRepository.stubs.findOne;
      messageRepositoryStub.resolves();
      const sampleError = await controller
        .fetchById(sampleMessageId, {
          extId: sampleExtId,
        })
        .catch(error => error);
      expect(sampleError).instanceof(Error);
      sinon.assert.calledOnce(groupCountStub);
      sinon.assert.calledOnce(messageRepositoryStub);
    });
  });
  describe('GET /mails', () => {
    it('gets a message', async () => {
      setUpStub();
      const groupRepositoryStub = groupRepository.stubs.find;
      groupRepositoryStub.resolves([group]);
      const messageRepositoryStub = messageRepository.stubs.find;
      messageRepositoryStub.resolves([message]);
      const limit = 10;
      const offset = 10;
      const type: StorageMarker = StorageMarker.inbox;
      const controllerResult = await controller.fetchMailList(
        {
          limit,
          offset,
        },
        {
          where: {
            storage: type,
          },
        },
      );
      expect(controllerResult).to.have.a.property('items');
      sinon.assert.calledOnce(messageRepositoryStub);
    });
    it('returns an empty array if there are no messages', async () => {
      setUpStub();
      const groupRepositoryStub = groupRepository.stubs.find;
      groupRepositoryStub.resolves([]);
      const limit = 10;
      const offset = 10;
      const type: StorageMarker = StorageMarker.inbox;
      const controllerResult = await controller.fetchMailList(
        {
          limit,
          offset,
        },
        {
          where: {
            storage: type,
          },
        },
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('items').which.is.empty;
      sinon.assert.calledOnce(groupRepositoryStub);
    });
    it('returns undefined array if offset/limit is negative ', async () => {
      setUpStub();
      const groupRepositoryStub = groupRepository.stubs.find;
      groupRepositoryStub.resolves([group]);
      const messageRepositoryStub = messageRepository.stubs.find;
      messageRepositoryStub.resolves([message]);
      const limit = -10;
      const offset = -10;
      const type: StorageMarker = StorageMarker.inbox;
      const controllerResult = await controller.fetchMailList(
        {
          limit,
          offset,
        },
        {
          where: {
            storage: type,
          },
        },
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('items').which.is.undefined;
      sinon.assert.calledOnce(messageRepositoryStub);
    });
  });

  describe('GET /threads', () => {
    it('gets a thread list', async () => {
      setUpStub();
      const threadRepositoryStub = threadRepository.stubs.find;
      threadRepositoryStub.resolves([thread]);
      const groupsStubs = groupRepository.stubs.find;
      groupsStubs.resolves(groups);
      const offset = 0;
      const limit = 1;
      const type: StorageMarker = StorageMarker.inbox;
      const controllerResult = await controller.fetchThreadList(
        {
          limit,
          offset,
        },
        {
          where: {
            storage: type,
          },
        },
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('items').which.is.an.Array;
      sinon.assert.calledOnce(threadRepositoryStub);
      sinon.assert.calledOnce(groupsStubs);
    });
    it('doesnt return anything if an limit or offset is less than zero', async () => {
      setUpStub();
      const threadRepositoryStub = threadRepository.stubs.find;
      threadRepositoryStub.resolves([thread]);
      const groupsStubs = groupRepository.stubs.find;
      groupsStubs.resolves(groups);
      const offset = -10;
      const limit = -12;
      const type: StorageMarker = StorageMarker.inbox;
      const controllerResult = await controller.fetchThreadList(
        {
          limit,
          offset,
        },
        {
          where: {
            storage: type,
          },
        },
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('items').which.is.undefined;
      sinon.assert.calledOnce(threadRepositoryStub);
      sinon.assert.calledOnce(groupsStubs);
    });
  });
});
