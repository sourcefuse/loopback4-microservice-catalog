import {inject} from '@loopback/context';
import {api, del, post, ResponseObject, HttpErrors} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {IAuthUserWithPermissions, CONTENT_TYPE} from '@sourceloop/core';
import {
  ComposeMailBody,
  ForwardMailBody,
} from '../types/compose-mail-body.type';
import {repository, Filter, DataObject} from '@loopback/repository';
import {
  GroupRepository,
  MessageRepository,
  ThreadRepository,
} from '../repositories';
import {
  Attachment,
  Message,
  Meta,
  PartyTypeMarker,
  Group,
  StatusMarker,
  StorageMarker,
  VisibilityMarker,
} from '../models';
import {
  getModelSchemaRef,
  requestBody,
  param,
  patch,
  put,
} from '@loopback/openapi-v3';

const FORBIDDEN_ERROR_MESSAGE =
  'Forbidden request due to unauthorized token in header.';
const NOT_FOUND_MESSAGE = 'Message identity does not exist.';
const ID_RESPONSE_SCHEMA = '#/components/schemas/idResponse';

@api({
  basePath: '/originator/{version}',
  paths: {},
  components: {
    schemas: {
      idResponse: {
        type: 'object',
        title: 'Message Compose Response Schema',
        properties: {
          id: {type: 'string', example: '123e4567-e89b-12d3-a456-426614174000'},
          version: {type: 'string', example: '20200101'},
        },
      },
    },
  },
})
export class OriginatorController {
  constructor(
    @repository(MessageRepository)
    public messageRepository: MessageRepository,
    @repository(ThreadRepository)
    public threadRepository: ThreadRepository,
    @repository(GroupRepository)
    public groupRepository: GroupRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    public user: IAuthUserWithPermissions,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @post('mails', {
    summary: 'ComposeAPI. For drafting, reply on and create new message',
    responses: {
      201: {
        description: 'collect single message for user by message identifier',
        content: {
          'application/json': {
            schema: {$ref: ID_RESPONSE_SCHEMA},
          },
        },
      } as ResponseObject,
      403: {description: FORBIDDEN_ERROR_MESSAGE},
      404: {description: NOT_FOUND_MESSAGE},
    },
  })
  async composeMail(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            type: 'object',
            properties: {
              threadId: {
                type: 'string',
              },
              groups: {
                type: 'array',
                items: getModelSchemaRef(Group, {
                  partial: true,
                  exclude: [
                    'extId',
                    'extMetadata',
                    'createdBy',
                    'createdOn',
                    'modifiedBy',
                    'modifiedOn',
                    'deleted',
                  ],
                }),
              },
              attachments: {
                type: 'array',
                items: getModelSchemaRef(Attachment, {
                  partial: true,
                  exclude: [
                    'extId',
                    'extMetadata',
                    'createdBy',
                    'createdOn',
                    'modifiedBy',
                    'modifiedOn',
                    'deleted',
                  ],
                }),
              },
              meta: {
                type: 'array',
                items: getModelSchemaRef(Meta, {
                  partial: true,
                  exclude: [
                    'extId',
                    'extMetadata',
                    'createdBy',
                    'createdOn',
                    'modifiedBy',
                    'modifiedOn',
                    'deleted',
                  ],
                }),
              },
              body: {
                type: 'string',
              },
              subject: {
                type: 'string',
              },
              status: {
                type: 'string',
              },
              extId: {
                type: 'string',
              },
              extMetadata: {
                type: 'object',
              },
            },
            required: ['body', 'group', 'status'],
          },
        },
      },
    })
    composeMailBody: ComposeMailBody,
    @param.path.string('version') version: string,
  ) {
    let {
      groups,
      extId,
      extMetadata,
      meta,
      attachments,
      status,
      subject,
      body,
      threadId,
    } = composeMailBody;
    // from will be fetched from the authenticated user
    groups = groups.filter(group => group?.type !== PartyTypeMarker.from);
    const thread = await this.threadRepository.incrementOrCreate(threadId, {
      subject,
      extId,
      extMetadata,
    });
    groups = groups.concat([
      new Group({
        party: this.user.email,
        type: PartyTypeMarker.from,
        threadId: thread.id,
        storage: StorageMarker.send,
      }),
    ]);
    const transaction = await this.messageRepository.beginTransaction();
    try {
      groups.forEach(group => {
        group.threadId = thread.id;
        group.extId = extId;
        group.extMetadata = extMetadata;
      });
      if (attachments?.length) {
        attachments.forEach(attachment => {
          attachment.extId = extId;
          attachment.extMetadata = extMetadata;
        });
      }
      if (meta?.length) {
        meta.forEach(m => {
          m.extId = extId;
          m.extMetadata = extMetadata;
        });
      }
      const mail = await this.messageRepository.createRelational(
        Object.assign(
          Object.assign(
            {},
            {
              sender: this.user.email,
              threadId: thread.id,
              extId,
              extMetadata,
              status,
              body,
              subject,
            },
          ),
          {
            groups,
            meta: meta,
            attachments,
          },
        ),
      );
      await transaction.commit();
      return {version, id: mail.id};
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @put('mails/{messageId}', {
    summary: 'Update API. Update draft messages.',
    responses: {
      201: {
        description: 'collect single message for user by message identifier',
        content: {
          'application/json': {
            schema: {$ref: ID_RESPONSE_SCHEMA},
          },
        },
      } as ResponseObject,
      403: {description: FORBIDDEN_ERROR_MESSAGE},
      404: {description: NOT_FOUND_MESSAGE},
      405: {description: "Asked message can't update."},
    },
    security: [{BearerAuth: []}],
  })
  async updateDraft(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            type: 'object',
            properties: {
              groups: {
                type: 'array',
                items: getModelSchemaRef(Group, {
                  partial: true,
                  exclude: [
                    'extId',
                    'extMetadata',
                    'createdBy',
                    'createdOn',
                    'modifiedBy',
                    'modifiedOn',
                    'deleted',
                  ],
                }),
              },
              attachments: {
                type: 'array',
                items: getModelSchemaRef(Attachment, {
                  partial: true,
                  exclude: [
                    'extId',
                    'extMetadata',
                    'createdBy',
                    'createdOn',
                    'modifiedBy',
                    'modifiedOn',
                    'deleted',
                  ],
                }),
              },
              meta: {
                type: 'array',
                items: getModelSchemaRef(Meta, {
                  partial: true,
                  exclude: [
                    'extId',
                    'extMetadata',
                    'createdBy',
                    'createdOn',
                    'modifiedBy',
                    'modifiedOn',
                    'deleted',
                  ],
                }),
              },
              body: {
                type: 'string',
              },
              subject: {
                type: 'string',
              },
              status: {
                type: 'string',
              },
              extId: {
                type: 'string',
              },
              extMetadata: {
                type: 'object',
              },
            },
            required: ['body', 'group'],
          },
        },
      },
    })
    composeMailBody: ComposeMailBody,
    @param.path.string('version') version: string,
    @param.path.string('messageId') messageId: string,
  ) {
    const {extId, extMetadata, subject, body} = composeMailBody;
    const mail = await this.messageRepository.findOne({
      where: {
        id: messageId,
      },
    });
    if (!mail) {
      throw new HttpErrors.NotFound('Mail not found');
    }
    if (mail.status !== StatusMarker.draft) {
      throw new HttpErrors.BadRequest(
        'Cannot Update mail as the message is already been sent',
      );
    }
    const transaction = await this.messageRepository.beginTransaction();
    // removing previous mails
    await this.messageRepository.attachments(messageId).patch(
      {
        deleted: true,
      },
      {},
      {transaction},
    );
    await this.messageRepository.meta(messageId).patch(
      {
        deleted: true,
      },
      {},
      {transaction},
    );
    await this.messageRepository.groups(messageId).patch(
      {
        deleted: true,
      },
      {},
      {transaction},
    );
    //
    // Root id is not allowed to update
    const createdOnBy = {
      createdBy: this.user.id,
      createdOn: new Date(),
    };
    const groups = composeMailBody.groups
      .map(e => {
        Object.assign(e, createdOnBy);
        e.extId = extId;
        e.extMetadata = extMetadata;
        e.threadId = mail.threadId;
        return new Group(e);
      })
      .concat([
        new Group({
          party: this.user.email,
          type: PartyTypeMarker.from,
          extId: extId,
          extMetadata,
          threadId: mail.threadId,
          createdBy: this.user.id,
          createdOn: new Date(),
        }),
      ]);
    const meta = composeMailBody.meta
      ? composeMailBody.meta.map(e => {
          Object.assign(e, createdOnBy);
          e.extId = extId;
          e.extMetadata = extMetadata;
          return new Meta(e);
        })
      : [];
    const attachments = composeMailBody.attachments
      ? composeMailBody.attachments.map(e => {
          Object.assign(e, createdOnBy);
          e.extId = extId;
          e.extMetadata = extMetadata;
          return new Attachment(e);
        })
      : [];
    const messageUpdateData: DataObject<Message> = {
      extId,
      extMetadata,
    };
    if (subject) messageUpdateData.subject = subject;
    if (body) messageUpdateData.body = body;
    await this.messageRepository.updateById(messageId, messageUpdateData);
    await Promise.all(
      attachments.map(e =>
        this.messageRepository.attachments(mail.id).create(e, {transaction}),
      ),
    );
    await Promise.all(
      groups.map(e =>
        this.messageRepository.groups(mail.id).create(e, {transaction}),
      ),
    );
    await Promise.all(
      meta.map(e =>
        this.messageRepository.meta(mail.id).create(e, {transaction}),
      ),
    );
    await transaction.commit();
    return {
      version,
      id: mail.id,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @patch('mails/{messageId}/forward', {
    summary: 'API provide interface to forward single message.',
    responses: {
      201: {
        description: 'Message is forwarded to another recipient',
        content: {
          'application/json': {
            schema: {$ref: ID_RESPONSE_SCHEMA},
          },
        },
      } as ResponseObject,
      403: {description: FORBIDDEN_ERROR_MESSAGE},
      404: {description: NOT_FOUND_MESSAGE},
    },
  })
  async forward(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            type: 'object',
            properties: {
              groups: {
                type: 'array',
                items: getModelSchemaRef(Group, {
                  partial: true,
                  exclude: [
                    'extId',
                    'extMetadata',
                    'createdBy',
                    'createdOn',
                    'modifiedBy',
                    'modifiedOn',
                    'deleted',
                  ],
                }),
              },
            },
            required: ['groups'],
          },
        },
      },
    })
    body: ForwardMailBody,
    @param.path.string('messageId') messageId: string,
    @param.path.string('version') version: string,
  ) {
    const message = await this.messageRepository.findOne({
      where: {
        id: messageId,
      },
    });
    if (!message) {
      throw new HttpErrors.NotFound('Mail not Found');
    }
    const createdOnBy = {
      createdBy: this.user.id,
      createdOn: new Date(),
    };
    const {groups} = body;
    const transaction = await this.messageRepository.beginTransaction();
    try {
      await Promise.all(
        groups.map(group => {
          // new group will be created on forward message
          Object.assign(group, createdOnBy);
          if (message.extId) group.extId = message.extId;
          if (message.extId) group.extMetadata = message.extMetadata;
          Object.assign(group, {threadId: message.threadId});
          return this.messageRepository.groups(message.id).create(group, {
            transaction,
          });
        }),
      );
      await this.threadRepository.incrementOrCreate(
        message.threadId,
        {},
        {transaction},
      );
      await transaction.commit();
      return {
        version,
        id: messageId,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @post('mails/{messageId}/attachments', {
    summary:
      'API provides an interface for adding attachment before message is sent.',
    responses: {
      201: {
        description: 'collect single attachment for user by message identifier',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'object',
              title: 'Attachment add response schema',
              properties: {
                attachmentId: {
                  type: 'string',
                  example: '123e4567-e89b-12d3-a456-426614174000',
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
  async addAttachment(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            type: 'object',
            properties: {
              attachments: {
                type: 'array',
                items: getModelSchemaRef(Attachment, {
                  partial: true,
                  exclude: [
                    'extId',
                    'extMetadata',
                    'createdBy',
                    'createdOn',
                    'modifiedBy',
                    'modifiedOn',
                    'deleted',
                  ],
                }),
              },
            },
          },
        },
      },
    })
    body: {
      attachments: Attachment[];
    },
    @param.path.string('version') version: string,
    @param.path.string('messageId') messageId: string,
    @param.query.object('filter') filter?: Partial<Message>,
  ): Promise<{
    version: string;
    items: Attachment[];
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
      throw new HttpErrors.NotFound(NOT_FOUND_MESSAGE);
    }
    if (message.status !== StatusMarker.draft) {
      throw new HttpErrors.BadRequest('Not allowed to update.');
    }
    const items = [];
    for (const attachment of body.attachments) {
      if (message.extId) attachment.extId = message.extId;
      if (message.extMetadata) attachment.extMetadata = message.extMetadata;
      attachment.createdBy = this.user.id;
      attachment.createdOn = new Date();
      items.push(
        this.messageRepository.attachments(message.id).create(attachment),
      );
    }
    return {
      items: await Promise.all(items),
      version,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @del('mails/{messageId}/attachments/{attachmentId}', {
    summary:
      'API provides an interface for removing attachment before message is sent',
    responses: {
      200: {
        description: 'Deletetion of Attachment Successful!',
      } as ResponseObject,
      403: {description: FORBIDDEN_ERROR_MESSAGE},
      404: {description: NOT_FOUND_MESSAGE},
    },
  })
  async removeAttachment(
    @param.path.string('messageId') messageId: string,
    @param.path.string('version') version: string,
    @param.path.string('attachmentId') attachmentId: string,
    @param.query.object('filter') filter: Partial<Message>,
  ): Promise<{
    version: string;
    item: string;
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
      throw new HttpErrors.NotFound(NOT_FOUND_MESSAGE);
    }
    if (message.status !== StatusMarker.draft) {
      throw new HttpErrors.BadRequest('Not allowed to update');
    }
    await this.messageRepository.attachments(messageId).patch({
      deleted: true,
    });
    return {version, item: attachmentId};
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @del('mails/{messageId}/{storage}/{action}', {
    summary:
      'API provides an interface for moving message to trash from inbox, draft, sent.',
    responses: {
      200: {
        description: 'Trash/Deletetion of Mail sucessful!',
      } as ResponseObject,
      403: {description: FORBIDDEN_ERROR_MESSAGE},
      404: {description: NOT_FOUND_MESSAGE},
    },
  })
  async trash(
    @param.path.string('version') version: string,
    @param.path.string('messageId') messageId: string,
    @param.path.string('storage') storage: StorageMarker,
    @param.query.object('filter') filter: Partial<Group>,
    @param.path.string('action') action: 'delete' | 'trash',
  ): Promise<{
    version: string;
    item: Group;
  }> {
    const groupWhere = {
      where: {
        storage,
        messageId,
        party: this.user.email,
      },
    };
    if (filter) {
      Object.assign(groupWhere.where, {
        ...filter,
      });
    }
    const group = await this.groupRepository.findOne(groupWhere);
    if (!group) {
      throw new HttpErrors.NotFound('Group Not Found');
    }
    if (action === 'trash') {
      if (storage === StorageMarker.trash) {
        throw new HttpErrors.BadRequest('Mail is already in trash');
      }
      group.deleted = false;
      group.storage = StorageMarker.trash;
    }
    if (action === 'delete') {
      if (storage !== StorageMarker.trash) {
        throw new HttpErrors.BadRequest(
          'Mail must be in trash for permanent deletion',
        );
      }
      group.deleted = true;
    }
    await this.groupRepository.update(group);
    return {version, item: group};
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @patch('mails/{messageId}/restore', {
    summary: 'API provides an interface for restore message from trash.',
    responses: {
      200: {description: 'Restor Message Successful!'} as ResponseObject,
      403: {description: FORBIDDEN_ERROR_MESSAGE},
      404: {description: NOT_FOUND_MESSAGE},
    },
  })
  async restore(
    @param.path.string('version') version: string,
    @param.path.string('messageId') messageId: string,
    @param.query.object('filter') filter: Partial<Group>,
  ): Promise<{
    version: string;
    item: Group;
  }> {
    const groupWhere = {
      where: {
        storage: {eq: StorageMarker.trash},
        messageId: {eq: messageId},
        party: {eq: this.user.email},
      },
    };
    if (filter) {
      Object.assign(groupWhere.where, {
        ...filter,
      });
    }
    const group = await this.groupRepository.findOne(groupWhere);
    if (!group) {
      throw new HttpErrors.NotFound('Trashed Message not Found');
    }
    if (
      [PartyTypeMarker.to, PartyTypeMarker.bcc, PartyTypeMarker.cc].includes(
        group.type,
      )
    ) {
      group.storage = StorageMarker.inbox;
    } else {
      group.storage = StorageMarker.send;
    }
    await this.groupRepository.update(group);
    return {
      version,
      item: group,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @patch('mails/{messageId}/send', {
    summary: 'API for sending a drafted message.',
    responses: {
      200: {description: 'Mail is Successfully sent!'} as ResponseObject,
      403: {description: FORBIDDEN_ERROR_MESSAGE},
      404: {description: NOT_FOUND_MESSAGE},
    },
  })
  async sendDraft(
    @param.path.string('version') version: string,
    @param.path.string('messageId') messageId: string,
    @param.query.object('filter') filter: Partial<Message>,
  ): Promise<{
    version: string;
    id: string;
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
      throw new HttpErrors.NotFound(NOT_FOUND_MESSAGE);
    }
    const transaction = await this.messageRepository.beginTransaction();
    await this.messageRepository.updateById(
      String(message.id),
      {
        status: StatusMarker.send,
      },
      {transaction},
    );
    await this.messageRepository.groups(messageId).patch(
      {
        storage: StorageMarker.inbox,
        visibility: VisibilityMarker.new,
        modifiedBy: this.user.id,
        modifiedOn: new Date(),
      },
      {messageId: {eq: messageId}},
      {transaction},
    );
    await transaction.commit();
    return {version, id: messageId};
  }
}
