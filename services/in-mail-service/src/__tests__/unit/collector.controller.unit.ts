// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Filter} from '@loopback/repository';
import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {CollectorController} from '../../controllers';
import {Group, Message, Thread} from '../../models';
import {
  AttachmentRepository,
  GroupRepository,
  MessageRepository,
  MetaRepository,
  ThreadRepository,
  ThreadViewRepository,
} from '../../repositories';
import {group, message, thread, user} from './sample-data';
const sampleThreadId = 'random-thread-id';
const sampleMessageId = 'sample-message-id';
const sampleGroupId = 'sample-group-id';
const grpCount = {
  count: 1,
};
let messageRepository: StubbedInstanceWithSinonAccessor<MessageRepository>;
let threadRepository: StubbedInstanceWithSinonAccessor<ThreadRepository>;
let groupRepository: StubbedInstanceWithSinonAccessor<GroupRepository>;
let attachmentRepository: StubbedInstanceWithSinonAccessor<AttachmentRepository>;
let metaRepository: StubbedInstanceWithSinonAccessor<MetaRepository>;
let threadViewRepository: StubbedInstanceWithSinonAccessor<ThreadViewRepository>;
let controller: CollectorController;
const setUpStub = () => {
  messageRepository = createStubInstance(MessageRepository);
  threadRepository = createStubInstance(ThreadRepository);
  groupRepository = createStubInstance(GroupRepository);
  attachmentRepository = createStubInstance(AttachmentRepository);
  metaRepository = createStubInstance(MetaRepository);
  threadViewRepository = createStubInstance(ThreadViewRepository);
  controller = new CollectorController(
    messageRepository,
    metaRepository,
    groupRepository,
    threadRepository,
    threadViewRepository,
    attachmentRepository,
    user,
  );
};
describe('collectorcontroller(unit) as', () => {
  describe('GET /threads/{threadId}', () => {
    it('get threadview and its count', async () => {
      setUpStub();
      const groupCountStub = groupRepository.stubs.count;
      groupCountStub.resolves(grpCount);
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([group]);
      const threadFindStub = threadViewRepository.stubs.find;
      threadFindStub.resolves([thread]);
      const groupUpdateStub = groupRepository.stubs.updateAll;
      groupUpdateStub.resolves(grpCount);
      const filter: Partial<Thread> = {id: sampleThreadId};
      const controllerResult = await controller.fetchThreadById(
        sampleThreadId,
        filter,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('messageCount').which.is.a
        .Number;
      expect(controllerResult).to.be.Object();
    });
    it('throws an error if there is no group', async () => {
      setUpStub();
      const filter: Partial<Thread> = {id: sampleThreadId};
      const controllerResult = await controller
        .fetchThreadById(sampleThreadId, filter)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });
  });

  describe('GET /mails/{messageId}', () => {
    it('get message from message id', async () => {
      setUpStub();
      const groupCountStub = groupRepository.stubs.count;
      groupCountStub.resolves(grpCount);
      const messageFindOneStub = messageRepository.stubs.findOne;
      messageFindOneStub.resolves(message);
      const groupUpdateStub = groupRepository.stubs.updateAll;
      groupUpdateStub.resolves(grpCount);
      const filter: Partial<Message> = {id: sampleMessageId};
      const controllerResult = await controller.fetchById(
        sampleMessageId,
        filter,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('item').which.is.a.Object;
      expect(controllerResult).to.be.Object();
    });
    it('throws an error if there is no group', async () => {
      setUpStub();
      const filter: Partial<Message> = {id: sampleMessageId};
      const controllerResult = await controller
        .fetchById(sampleMessageId, filter)
        .catch(error => error);
      expect(controllerResult).instanceOf(Error);
    });
  });

  describe('GET /threads', () => {
    it('get thread from thread filter', async () => {
      setUpStub();
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([group]);
      const threadFindStub = threadRepository.stubs.find;
      threadFindStub.resolves([thread]);
      const filterThread: Filter<Thread> = {
        where: {
          and: [{id: sampleThreadId}],
        },
      };
      const filterGroup: Filter<Group> = {
        where: {
          and: [{id: sampleGroupId}],
        },
      };
      const controllerResult = await controller.fetchThreadList(
        filterThread,
        filterGroup,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('items').which.is.a.Object;
      expect(controllerResult).to.be.Object();
    });
  });

  describe('GET /mails', () => {
    it('get mails from message filter', async () => {
      setUpStub();
      const groupFindStub = groupRepository.stubs.find;
      groupFindStub.resolves([group]);
      const messageFindOneStub = messageRepository.stubs.find;
      messageFindOneStub.resolves([message]);
      const messageCountStub = messageRepository.stubs.count;
      messageCountStub.resolves(grpCount);
      const groupCountStub = groupRepository.stubs.count;
      groupCountStub.resolves(grpCount);
      const filterMessage: Filter<Message> = {
        where: {
          and: [{id: sampleMessageId}],
        },
      };
      const filterGroup: Filter<Group> = {
        where: {
          and: [{id: sampleGroupId}],
        },
      };
      const controllerResult = await controller.fetchMailList(
        filterMessage,
        filterGroup,
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerResult).to.have.a.property('items').which.is.a.Object;
      expect(controllerResult).to.be.Object();
    });
  });
});
