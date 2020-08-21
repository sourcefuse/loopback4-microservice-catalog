import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';

import {
  MessageRepository,
  GroupRepository,
  ThreadRepository,
  MetaRepository,
  AttachmentRepository,
} from '../../../repositories';
import {givenEmptyDatabases} from '../../helpers/database.helper';
import {
  getSampleUser,
  getSampleMailData,
} from '../../helpers/sample-data.helper';
import {OriginatorController} from '../../../controllers';

describe('OriginatorController', () => {
  console.log('boom');
  const givenStubbedRepository = () => {
    messageRepository = createStubInstance(MessageRepository);
    groupRepository = createStubInstance(GroupRepository);
    threadRepository = createStubInstance(ThreadRepository);
    attachmentRepository = createStubInstance(AttachmentRepository);
    metaRepository = createStubInstance(MetaRepository);
  };
  // before(getSampleUser);
  // beforeEach(givenEmptyDatabases);
  let messageRepository: StubbedInstanceWithSinonAccessor<MessageRepository>;
  let groupRepository: StubbedInstanceWithSinonAccessor<GroupRepository>;
  let threadRepository: StubbedInstanceWithSinonAccessor<ThreadRepository>;
  let attachmentRepository: StubbedInstanceWithSinonAccessor<AttachmentRepository>;
  let metaRepository: StubbedInstanceWithSinonAccessor<MetaRepository>;
  beforeEach(givenStubbedRepository);

  let originatorController: OriginatorController;
  let sampleVersion = '1.0.1';
  afterEach(() => sinon.restore());

  describe('POST /originator/{version}/mails', async () => {
    it('sends a mail to the receipients', async () => {
      const sampleMailData = getSampleMailData();
      originatorController = new OriginatorController(
        messageRepository,
        threadRepository,
        groupRepository,
        getSampleUser(),
      );
      const response = originatorController.composeMail(sampleMailData, sampleVersion);
      expect(response).to.be.a.Object;
    });
  });
});
