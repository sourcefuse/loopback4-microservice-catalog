import {inject} from '@loopback/context';
import {
  AnyObject,
  Filter,
  FilterBuilder,
  repository,
  WhereBuilder,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  ResponseObject,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  STATUS_CODE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Group, Message, Thread} from '../models';
import {
  AttachmentRepository,
  GroupRepository,
  MessageRepository,
  MetaRepository,
  ThreadRepository,
  ThreadViewRepository,
} from '../repositories';
import {PermissionsEnums, VisibilityMarker} from '../types';

const NOT_FOUND_MESSAGE = 'Message identity does not exist';
const FORBIDDEN_ERROR_MESSAGE =
  'Forbidden request due to unauthrized token in header.';

export class CollectorController {
  constructor(
    @repository(MessageRepository) public messageRepository: MessageRepository,
    @repository(MetaRepository) public metaRepository: MetaRepository,
    @repository(GroupRepository) public groupRepository: GroupRepository,
    @repository(ThreadRepository) public threadRepository: ThreadRepository,
    @repository(ThreadViewRepository)
    public threadViewRepository: ThreadViewRepository,
    @repository(AttachmentRepository)
    public attachmentRepository: AttachmentRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    public user: IAuthUserWithPermissions,
  ) {}

  getInMailIdentifierType(type: string | undefined): string {
    return String(type === 'user' ? this.user.id : this.user.email);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionsEnums.GetThread]})
  @get('threads/{threadId}', {
    security: OPERATION_SECURITY_SPEC,
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
      party: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
    });
    if (!count) {
      throw new HttpErrors.BadRequest('Group not found');
    }
    const messageIdObject = await this.groupRepository.find({
      where: {
        threadId: threadId,
        party: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
      },
      fields: {messageId: true},
    });
    let messageIds: string[] = [];
    if (messageIdObject) {
      messageIds = messageIdObject.map(msg => msg.messageId);
    }
    const threadView = await this.threadViewRepository.find({
      where: {
        messageId: {inq: messageIds},
      },
    });
    await this.groupRepository.updateAll(
      {visibility: VisibilityMarker.read},
      {
        threadId: threadId,
        party: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
      },
    );

    return {items: threadView, messageCount: threadView.length};
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionsEnums.GetInMail]})
  @get('mails/{messageId}', {
    security: OPERATION_SECURITY_SPEC,
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
      party: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
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
              party: this.getInMailIdentifierType(
                process.env.INMAIL_IDENTIFIER_TYPE,
              ),
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

    await this.groupRepository.updateAll(
      {visibility: VisibilityMarker.read},
      {
        messageId: message?.id,
        party: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
      },
    );
    if (!message) {
      throw new HttpErrors.NotFound('Message Not Found');
    }
    return {
      item: message,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionsEnums.GetThread]})
  @get('threads', {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({permissions: [PermissionsEnums.GetInMails]})
  @get('mails', {
    security: OPERATION_SECURITY_SPEC,
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
    totalCount: number;
    unreadCount: number;
  }> {
    const messageIds = (await this.groupRepository.find(filterGroup))
      .map(({messageId}) => messageId)
      .filter((v, i, a) => a.indexOf(v) === i);

    const filter = this.createFetchMailListFilter(filterMessage, messageIds);

    if (!messageIds?.length) {
      return {
        items: [],
        totalCount: 0,
        unreadCount: 0,
      };
    }

    const mails = await this.messageRepository.find(filter);
    mails.forEach((mail: AnyObject) => {
      if (mail.group) {
        mail.group = mail.group.map((grp: Group) => {
          if (grp.party !== this.user.id) {
            delete grp.visibility;
            delete grp.isImportant;
            delete grp.storage;
          }
          return grp;
        });
      }
    });
    const totalCount = await this.messageRepository.count(filter.where);
    const where = filterGroup.where;
    const whereBuilder = new WhereBuilder<Group>();
    if (where) {
      whereBuilder.and(where, {
        visibility: {neq: VisibilityMarker.read},
      });
    } else {
      whereBuilder.neq('visibility', VisibilityMarker.read);
    }
    const unreadCount = await this.groupRepository.count(whereBuilder.build());
    return {
      items: mails,
      totalCount: totalCount.count,
      unreadCount: unreadCount.count,
    };
  }

  createFetchMailListFilter(filter: Filter<Message>, messageIds: string[]) {
    const whereClause = filter.where;
    const filterBuilder = new FilterBuilder(filter);
    const whereBuilder = new WhereBuilder<Message>();
    if (whereClause) {
      whereBuilder.and(whereClause, {
        id: {inq: messageIds},
      });
    }
    if (!whereClause) {
      whereBuilder.inq('id', messageIds);
    }
    filterBuilder.include(
      {
        relation: 'group',
        scope: {
          fields: {
            party: true,
            type: true,
            messageId: true,
            visibility: true,
            isImportant: true,
            storage: true,
          },
        },
      },
      {
        relation: 'attachment',
        scope: {
          fields: {
            messageId: true,
            id: true,
            name: true,
            mime: true,
          },
        },
      },
    );
    filterBuilder.where(whereBuilder.build());
    return filterBuilder.build();
  }
}
