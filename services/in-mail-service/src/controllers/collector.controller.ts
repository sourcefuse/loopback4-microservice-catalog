import {inject} from '@loopback/context';
import {
  get,
  ResponseObject,
  param,
  HttpErrors,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {repository, Filter} from '@loopback/repository';
import {
  AttachmentRepository,
  MessageRepository,
  GroupRepository,
  ThreadRepository,
  MetaRepository,
} from '../repositories';
import {Message, Thread, Group} from '../models';
import {
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  STATUS_CODE,
} from '@sourceloop/core';
import {PermissionsEnums} from '../types';

const NOT_FOUND_MESSAGE = 'Message identity does not exist';
const FORBIDDEN_ERROR_MESSAGE =
  'Forbidden request due to unauthrized token in header.';

export class CollectorController {
  constructor(
    @repository(MessageRepository) public messageRepository: MessageRepository,
    @repository(MetaRepository) public metaRepository: MetaRepository,
    @repository(GroupRepository) public groupRepository: GroupRepository,
    @repository(ThreadRepository) public threadRepository: ThreadRepository,
    @repository(AttachmentRepository)
    public attachmentRepository: AttachmentRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    public user: IAuthUserWithPermissions,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.GetThread])
  @get('threads/{threadId}', {
    summary:
      'GET Thread Message API. Collect complete single message thread based on thread identity.',
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'Fetches a thread along with message, group, attachment(s) etc based on unique thread Id',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              properties: {
                item: getModelSchemaRef(Thread),
              },
            },
          },
        },
      },
      [STATUS_CODE.FORBIDDEN]: {
        description: `Forbidden request due to unauthorized token in header.`,
      },
      [STATUS_CODE.BAD_REQUEST]: {description: NOT_FOUND_MESSAGE},
    },
  })
  async fetchThreadById(
    @param.path.string('threadId') threadId: string,
    @param.query.object('filter') filter: Partial<Thread>,
  ) {
    const {count} = await this.groupRepository.count({
      threadId,
      party:
        process.env.INMAIL_IDENTIFIER_TYPE === 'user'
          ? this.user.id
          : this.user.email,
    });
    if (!count) {
      throw new HttpErrors.BadRequest('Group not found');
    }
    const threadFilter: Filter<Thread> = {
      where: {
        id: threadId,
      },
      include: [
        {
          relation: 'message',
          scope: {
            include: [
              {
                relation: 'meta',
              },
              {
                relation: 'group',
                scope: {
                  where: {
                    party:
                      process.env.INMAIL_IDENTIFIER_TYPE === 'user'
                        ? this.user.id
                        : this.user.email,
                  },
                },
              },
              {
                relation: 'attachment',
              },
            ],
          },
        },
      ],
      order: ['createdOn DESC'],
    };
    if (filter) {
      Object.assign(threadFilter.where, {
        ...filter,
      });
    }
    const thread = await this.threadRepository.findOne(threadFilter);
    if (!thread) {
      throw new Error('Thread not found');
    }
    return {items: thread};
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.GetInMail])
  @get('mails/{messageId}', {
    summary:
      'GET Message API. Collect a single message based on message identity.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Gets mail details based on unique message id',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              properties: {
                item: {
                  type: 'string',
                  item: getModelSchemaRef(Message, {
                    exclude: ['deleted'],
                    includeRelations: true,
                  }),
                },
              },
            },
          },
        },
      } as ResponseObject,
      [STATUS_CODE.FORBIDDEN]: {description: FORBIDDEN_ERROR_MESSAGE},
      [STATUS_CODE.NOT_FOUND]: {description: NOT_FOUND_MESSAGE},
    },
  })
  async fetchById(
    @param.path.string('messageId') messageId: string,
    @param.query.object('filter') filter: Partial<Message>,
  ): Promise<{
    item: Message | null;
  }> {
    const {count} = await this.groupRepository.count({
      messageId,
      party:
        process.env.INMAIL_IDENTIFIER_TYPE === 'user'
          ? this.user.id
          : this.user.email,
    });
    if (!count) {
      throw new HttpErrors.BadRequest('Group not found');
    }
    const messageFilter: Filter<Message> = {
      where: {
        id: messageId,
      },
      include: [
        {
          relation: 'meta',
        },
        {
          relation: 'group',
          scope: {
            where: {
              party:
                process.env.INMAIL_IDENTIFIER_TYPE === 'user'
                  ? this.user.id
                  : this.user.email,
            },
          },
        },
        {
          relation: 'attachment',
        },
      ],
      order: ['createdOn DESC'],
    };
    if (filter) {
      Object.assign(messageFilter.where, {
        ...filter,
      });
    }
    const message = await this.messageRepository.findOne(messageFilter);
    if (!message) {
      throw new HttpErrors.NotFound('Message Not Found');
    }
    return {
      item: message,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.GetThread])
  @get('threads', {
    summary: 'Thread List API. Collect a list of all threads.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'fetch threads',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              properties: {
                version: {
                  type: 'string',
                },
                items: {
                  type: 'array',
                  items: getModelSchemaRef(Thread),
                },
              },
            },
          },
        },
      },
    },
    [STATUS_CODE.FORBIDDEN]: {description: FORBIDDEN_ERROR_MESSAGE},
  })
  async fetchThreadList(
    @param.query.object('threadFilter') filterThread: Filter<Thread>,
    @param.query.object('groupFilter') filterGroup: Filter<Group>,
  ): Promise<{
    items: Thread[];
  }> {
    const threadIds = (await this.groupRepository.find(filterGroup))
      .map(({threadId: id}) => id)
      .filter((v, i, a) => a.indexOf(v) === i);

    if (!threadIds?.length) {
      return {
        items: [],
      };
    }

    if (!filterThread) {
      filterThread = {
        where: {
          id: {inq: threadIds},
        },
      };
    } else if (!filterThread.where) {
      filterThread.where = {
        id: {inq: threadIds},
      };
    } else {
      Object.assign(filterThread.where, {
        id: {inq: threadIds},
      });
    }

    const threads = await this.threadRepository.find(filterThread);
    return {
      items: threads,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.GetInMails])
  @get('mails', {
    summary: 'Collect a list of all messages.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'fetch mails',
        content: {
          [CONTENT_TYPE.JSON]: {
            type: 'object',
            properties: {
              version: {
                type: 'string',
              },
              items: {
                type: 'array',
                schema: getModelSchemaRef(Message),
              },
            },
            nullable: true,
          },
        },
      },
      [STATUS_CODE.FORBIDDEN]: {description: FORBIDDEN_ERROR_MESSAGE},
    },
  })
  async fetchMailList(
    @param.query.object('messageFilter') filterMessage: Filter<Message>,
    @param.query.object('groupFilter') filterGroup: Filter<Group>,
  ): Promise<{
    items: Message[];
  }> {
    const messageIds = (await this.groupRepository.find(filterGroup))
      .map(({messageId}) => messageId)
      .filter((v, i, a) => a.indexOf(v) === i);

    if (!messageIds?.length) {
      return {
        items: [],
      };
    }

    if (!filterMessage) {
      filterMessage = {
        where: {
          id: {inq: messageIds},
        },
      };
    } else if (!filterMessage.where) {
      filterMessage.where = {
        id: {inq: messageIds},
      };
    } else {
      Object.assign(filterMessage.where, {
        id: {inq: messageIds},
      });
    }
    const mails = await this.messageRepository.find(filterMessage);
    return {
      items: mails,
    };
  }
}
