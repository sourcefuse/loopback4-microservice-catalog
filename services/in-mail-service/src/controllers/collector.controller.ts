import {inject} from '@loopback/context';
import {
  api,
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
import {
  StorageMarker,
  Message,
  Thread,
  Group,
  Meta,
  Attachment,
} from '../models';
import {CONTENT_TYPE, IAuthUserWithPermissions} from '@sourceloop/core';

const NOT_FOUND_MESSAGE = 'Message identity does not exist';
const FORBIDDEN_ERROR_MESSAGE =
  'Forbidden request due to unauthrized token in header.';

@api({
  basePath: '/collector/{version}',
})
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
  @authorize(['*'])
  @get('threads/{threadId}', {
    summary:
      'GET Thread Message API. Collect complete single message thread based on thread identity.',
    responses: {
      200: {
        description:
          'Fetches a thread along with message, group, attachment(s) etc based on unique thread Id',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              title: 'MailResponse',
              properties: {
                id: {type: 'string'},
                subject: {type: 'string'},
                body: {type: 'string'},
                groups: {
                  type: 'array',
                  items: getModelSchemaRef(Group, {
                    exclude: ['deleted'],
                  }),
                },
              },
            },
          },
        },
      } as ResponseObject,
      403: {
        description: `Forbidden request due to unauthorized token in header.`,
      },
      404: {description: NOT_FOUND_MESSAGE},
    },
  })
  async fetchThreadById(
    @param.path.string('version') version: string,
    @param.path.string('threadId') threadId: string,
    @param.query.object('filter') filter: Partial<Thread>,
  ) {
    const threadFilter: Filter<Thread> = {
      where: {
        id: threadId,
      },
    };
    if (filter) {
      Object.assign(threadFilter.where, {
        ...filter,
      });
    }
    const thread = await this.threadRepository.find(threadFilter, {
      include: [
        {
          relation: 'message',
          include: [
            {
              relation: 'meta',
            },
            {
              relation: 'group',
            },
            {
              relation: 'attachment',
            },
          ],
          order: ['createdOn DESC'],
        },
      ],
    });
    return {version, items: thread};
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @get('mails/{messageId}', {
    summary:
      'GET Message API. Collect a single message based on message identity.',
    responses: {
      200: {
        description: 'Gets mail details based on unique message id',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              title: 'MailResponse',
              properties: {
                id: {type: 'string'},
                subject: {type: 'string'},
                body: {type: 'string'},
                groups: {
                  type: 'array',
                  items: getModelSchemaRef(Group, {
                    exclude: ['deleted'],
                  }),
                },
              },
            },
          },
        },
      } as ResponseObject,
      403: {description: FORBIDDEN_ERROR_MESSAGE},
      404: {description: NOT_FOUND_MESSAGE},
    },
  })
  async fetchById(
    @param.path.string('version') version: string,
    @param.path.string('messageId') messageId: string,
    @param.query.object('filter') filter: Partial<Message>,
  ): Promise<{
    version: string;
    item: Message | null;
  }> {
    const messageFilter: Filter<Message> = {
      where: {
        id: messageId,
      },
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
      version,
      item: message,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @get('threads/{offset}/{limit}', {
    summary: 'Thread List API. Collect a list of all threads.',
    responses: {
      200: {
        description: '',
        content: {
          [CONTENT_TYPE.JSON]: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'Unique message id.',
                      example: 'message@example.com',
                    },
                    subject: {type: 'string', example: 'Message subject'},
                    groups: {
                      type: 'array',
                      schema: getModelSchemaRef(Group, {
                        exclude: ['deleted'],
                      }),
                    },
                    meta: {
                      schema: getModelSchemaRef(Meta, {
                        exclude: ['deleted'],
                      }),
                    },
                    attachments: {
                      schema: getModelSchemaRef(Attachment, {
                        exclude: ['deleted'],
                      }),
                    },
                    storage: {
                      type: 'string',
                      enum: ['draft', 'inbox', 'trash', 'delete', 'send'],
                      description: "Individual's storage for message",
                    },
                    status: {
                      type: 'string',
                      enum: ['draft', 'send'],
                      description:
                        'status of message whether message is send or still in draft state.',
                    },
                  },
                },
                nullable: true,
              },
              version: {type: 'string', example: '20200101'},
            },
          },
        },
      } as ResponseObject,
      403: {description: FORBIDDEN_ERROR_MESSAGE},
    },
  })
  async fetchThreadList(
    @param.path.string('version') version: string,
    @param.path.number('offset') offset: number,
    @param.path.number('limit') limit: number,
    @param.query.object('filter') filter: Partial<Thread>,
  ): Promise<{
    version: string;
    items: Thread[];
  }> {
    const threadIds = (
      await this.groupRepository.find({
        where: {party: {eq: this.user.email}},
        fields: {threadId: true},
      })
    )
      .map(({threadId}) => threadId)
      .filter((v, i, a) => a.indexOf(v) === i);

    const threadFilter = {
      include: [
        {
          relation: 'message',
          include: [
            {
              relation: 'meta',
            },
            {
              relation: 'group',
            },
            {
              relation: 'attachment',
            },
          ],
          order: ['createdOn DESC'],
        },
      ],
      where: {id: {inq: threadIds}},
      offset,
      limit,
    };
    if (filter) {
      Object.assign(threadFilter.where, {
        ...filter,
      });
    }

    const threads = await this.threadRepository.find(threadFilter);
    return {
      version,
      items: threads,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @get('mails/{offset}/{limit}/{type}', {
    summary: 'Collect a list of all inbox message.',
    responses: {
      200: {
        description: '',
        content: {
          [CONTENT_TYPE.JSON]: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'Unique message id.',
                      example: 'message@example.com',
                    },
                    subject: {type: 'string', example: 'Message subject'},
                    groups: {
                      type: 'array',
                      schema: getModelSchemaRef(Group, {
                        exclude: ['deleted'],
                      }),
                    },
                    meta: {
                      schema: getModelSchemaRef(Meta, {
                        exclude: ['deleted'],
                      }),
                    },
                    attachments: {
                      schema: getModelSchemaRef(Attachment, {
                        exclude: ['deleted'],
                      }),
                    },
                    storage: {
                      type: 'string',
                      enum: ['draft', 'inbox', 'trash', 'delete', 'send'],
                      description: "Individual's storage for message",
                    },
                    status: {
                      type: 'string',
                      enum: ['draft', 'send'],
                      description:
                        'status of message whether message is send or still in draft state.',
                    },
                  },
                },
                nullable: true,
              },
              version: {type: 'string', example: '20200101'},
            },
          },
        },
      } as ResponseObject,
      403: {description: FORBIDDEN_ERROR_MESSAGE},
    },
  })
  async fetchInboxList(
    @param.path.string('version') version: string,
    @param.path.number('offset') offset: number,

    @param.path.number('limit') limit: number,
    @param.path.string('type') type: StorageMarker,
    @param.query.object('filter') filter: Filter<Message>,
  ): Promise<{
    version: string;
    items: Message[];
  }> {
    const messageIds = (
      await this.groupRepository.find({
        where: {party: {eq: this.user.email}, storage: type},
        fields: {messageId: true},
      })
    )
      .map(({messageId}) => messageId)
      .filter((v, i, a) => a.indexOf(v) === i);

    const messageFilter: Filter<Message> = {
      include: [
        {
          relation: 'group',
        },
      ],
      where: {id: {inq: messageIds}},
      offset,
      limit,
    };
    if (filter) {
      Object.assign(messageFilter.where, {
        ...filter,
      });
    }
    const mails = await this.messageRepository.find(messageFilter);
    return {
      version,
      items: mails,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @get('mails/{messageId}/attachments', {
    summary:
      'API provides an interface for providing data for all attachment in message.',
    responses: {
      403: {description: FORBIDDEN_ERROR_MESSAGE},
      200: {
        description: '',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'object',
              properties: {
                items: getModelSchemaRef(Attachment, {
                  exclude: ['deleted'],
                }),
                version: {type: 'string'},
              },
            },
          },
        },
      } as ResponseObject,
    },
  })
  async fetchAttachments(
    @param.path.string('version') version: string,
    @param.path.string('messageId') messageId: string,
    @param.query.object('filter') filter: Partial<Attachment>,
  ) {
    const attachmentFilter = {
      where: {messageId: {eq: messageId}},
      fields: {name: true, id: true, mime: true, path: true, thumbnail: true},
    };
    if (filter) {
      Object.assign(attachmentFilter.where, {
        ...filter,
      });
    }
    const attachments = await this.attachmentRepository.find(attachmentFilter);
    return {version, items: attachments};
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @get('mails/{messageId}/meta-data', {
    summary:
      'Collect a meta data for a single message based on message identity.',
    responses: {
      403: {description: FORBIDDEN_ERROR_MESSAGE},
      404: {description: NOT_FOUND_MESSAGE},
      200: {
        description: 'MetaData related to a single Mail',
        content: {
          [CONTENT_TYPE.JSON]: {
            type: 'object',
            properties: {
              version: {type: 'string '},
              items: {
                type: 'array',
                schema: getModelSchemaRef(Meta, {
                  exclude: ['deleted'],
                }),
              },
            },
          },
        },
      },
    },
  })
  async fetchMetaData(
    @param.path.string('messageId') messageId: string,
    @param.path.string('version') version: string,
    @param.query.object('filter') filter: Partial<Message>,
  ): Promise<{
    items: Meta[];
    version: string;
  }> {
    const messageFilter = {
      where: {
        id: messageId,
      },
    };

    if (filter) {
      Object.assign(messageFilter.where, {
        ...filter,
      });
    }
    const message = await this.messageRepository.findOne(messageFilter);
    if (!message) {
      throw new HttpErrors.NotFound('Message not found');
    }
    const items = await this.metaRepository.find({
      where: {
        messageId: message.id,
      },
    });
    return {
      version,
      items,
    };
  }
}
