import {Getter} from '@loopback/core';
import {
  MessageRepository,
  AttachmentRepository,
  GroupRepository,
  MetaRepository,
  ThreadRepository,
} from '../../repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';
import {IAuthUserWithPermissions} from '@sourceloop/core';

export async function givenEmptyDatabases() {
  let messageRepository: MessageRepository;
  let attachmentRepository: AttachmentRepository;
  let groupRepository: GroupRepository;
  let metaRepository: MetaRepository;
  let threadRepository: ThreadRepository;
  let getCurrentUser: IAuthUserWithPermissions | undefined;
  groupRepository = new GroupRepository(
    testdb,
    Getter.fromValue(getCurrentUser),
  );
  metaRepository = new MetaRepository(testdb, Getter.fromValue(getCurrentUser));
  attachmentRepository = new AttachmentRepository(
    testdb,
    Getter.fromValue(getCurrentUser),
  );
  messageRepository = new MessageRepository(
    testdb,
    Getter.fromValue(attachmentRepository),
    Getter.fromValue(groupRepository),
    Getter.fromValue(metaRepository),
    Getter.fromValue(getCurrentUser),
  );
  threadRepository = new ThreadRepository(
    testdb,
    Getter.fromValue(messageRepository),
    Getter.fromValue(groupRepository),
    Getter.fromValue(getCurrentUser),
  );
  await Promise.all([
    messageRepository.deleteAll(),
    attachmentRepository.deleteAll(),
    threadRepository.deleteAll(),
    groupRepository.deleteAll(),
    metaRepository.deleteAll(),
  ]);
}
