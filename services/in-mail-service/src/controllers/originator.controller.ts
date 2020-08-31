import {inject} from '@loopback/context';
import {api, del, post, ResponseObject, HttpErrors} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {
  IAuthUserWithPermissions,
  CONTENT_TYPE,
  STATUS_CODE,
} from '@sourceloop/core';
import {
  ComposeMailBody,
  ForwardMailBody,
} from '../types/compose-mail-body.type';
import {repository, Filter, DataObject} from '@loopback/repository';
import {
  GroupRepository,
  MessageRepository,
  ThreadRepository,
  AttachmentRepository,
} from '../repositories';
import {
  Attachment,
  Message,
  Meta,
  Group,
  StatusMarker,
  IdResponse,
  IdArrays,
} from '../models';
import {
  getModelSchemaRef,
  requestBody,
  param,
  patch,
  put,
} from '@loopback/openapi-v3';
import {PermissionsEnums, PartyTypeMarker, StorageMarker} from '../types';

const FORBIDDEN_ERROR_MESSAGE =
  'Forbidden request due to unauthorized token in header.';
const NOT_FOUND_MESSAGE = 'Message identity does not exist.';
const ID_RESPONSE_SCHEMA = '#/components/schemas/idResponse';
const COMPOSE_MAIL_SCHEMA = '#/components/schemas/composeMailBody';

@api({
  paths: {},
  components: {
    schemas: {
      idResponse: getModelSchemaRef(IdResponse),
      composeMailBody: {
        type: 'object',
        properties: {
          threadId: {
            type: 'string',
          },
          groups: {
            type: 'array',
            items: getModelSchemaRef(Group, {
              partial: true,
            }),
          },
          attachments: {
            type: 'array',
            items: getModelSchemaRef(Attachment, {
              partial: true,
            }),
          },
          meta: {
            type: 'array',
            items: getModelSchemaRef(Meta, {
              partial: true,
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
        required: ['body', 'groups', 'status'],
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
    @repository(AttachmentRepository)
    public attachmentRepository: AttachmentRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    public user: IAuthUserWithPermissions,
  ) {}
  getInMailIdentifierType(type: string | undefined): string {
    return String(type === 'user' ? this.user.id : this.user.email);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.ComposeMail])
  @post('mails', {
    summary: 'ComposeAPI. For drafting, reply on and create new message',
    responses: {
      201: {
        description: 'collect single message for user by message identifier',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {$ref: ID_RESPONSE_SCHEMA},
          },
        },
      } as ResponseObject,
      [STATUS_CODE.FORBIDDEN]: {description: FORBIDDEN_ERROR_MESSAGE},
      [STATUS_CODE.NOT_FOUND]: {description: NOT_FOUND_MESSAGE},
    },
  })
  async composeMail(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            $ref: COMPOSE_MAIL_SCHEMA,
          },
        },
      },
    })
    composeMailBody: ComposeMailBody,
  ) {
    const {
      extId,
      extMetadata,
      meta,
      attachments,
      status,
      subject,
      body,
      threadId,
    } = composeMailBody;
    let {groups} = composeMailBody;
    // from will be fetched from the authenticated user
    groups = groups.filter(group => group?.type !== PartyTypeMarker.from);
    if (!groups?.length) {
      throw new HttpErrors.BadRequest(
        'Please add atlease one receipient in a group',
      );
    }
    const thread = await this.threadRepository.incrementOrCreate(threadId, {
      subject,
      extId,
      extMetadata,
    });
    groups = groups.concat([
      new Group({
        party: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
        type: PartyTypeMarker.from,
        threadId: thread.id,
        storage:
          status === StorageMarker.draft
            ? StorageMarker.draft
            : StorageMarker.send,
      }),
    ]);
    const transaction = await this.messageRepository.beginTransaction();
    try {
      groups.forEach(group => {
        group.threadId = thread.id;
        group.extId = extId;
        group.extMetadata = extMetadata;
        group.storage =
          status === StorageMarker.draft
            ? StorageMarker.draft
            : StorageMarker.send;
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
              sender:
                process.env.INMAIL_IDENTIFIER_TYPE === 'user'
                  ? this.user.id
                  : this.user.email,
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
      return {id: mail.id};
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }
  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.UpdateMail])
  @put('mails/{messageId}', {
    summary: 'Update API. Update draft messages.',
    responses: {
      [CONTENT_TYPE.JSON]: {
        description: 'collect single message for user by message identifier',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {$ref: ID_RESPONSE_SCHEMA},
          },
        },
      } as ResponseObject,
      [STATUS_CODE.FORBIDDEN]: {description: FORBIDDEN_ERROR_MESSAGE},
      [STATUS_CODE.BAD_REQUEST]: {description: NOT_FOUND_MESSAGE},
    },
    security: [{BearerAuth: []}],
  })
  async updateDraft(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            $ref: COMPOSE_MAIL_SCHEMA,
          },
        },
      },
    })
    composeMailBody: ComposeMailBody,
    @param.path.string('messageId') messageId: string,
  ) {
    const {extId, extMetadata, subject, body, status} = composeMailBody;
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
    await this.messageRepository
      .attachments(messageId)
      .patch({deleted: true}, {}, {transaction});
    await this.messageRepository
      .meta(messageId)
      .patch({deleted: true}, {}, {transaction});
    await this.messageRepository
      .groups(messageId)
      .patch({deleted: true}, {}, {transaction});
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
        e.storage =
          status === StorageMarker.draft
            ? StorageMarker.draft
            : StorageMarker.send;
        e.extMetadata = extMetadata;
        e.threadId = mail.threadId;
        return new Group(e);
      })
      .concat([
        new Group({
          party: this.getInMailIdentifierType(
            process.env.INMAIL_IDENTIFIER_TYPE,
          ),
          type: PartyTypeMarker.from,
          extId: extId,
          extMetadata,
          threadId: mail.threadId,
          createdBy: this.user.id,
          createdOn: new Date(),
          storage:
            status === StorageMarker.draft
              ? StorageMarker.draft
              : StorageMarker.send,
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
      id: mail.id,
    };
  }
  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.ReplyMail])
  @patch('threads/{threadId}/mails/{messageId}/replies', {
    summary: 'API provides interface to reply to a single message',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message is replied back to the sender',
      },
    },
  })
  async replyMail(
    @param.path.string('threadId') threadId: string,
    @param.path.string('messageId') messageId: string,
    @param.query.boolean('replyAll') replyAll: boolean,
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
                }),
              },
              meta: {
                type: 'array',
                items: getModelSchemaRef(Meta, {
                  partial: true,
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
            },
            required: ['body', 'group', 'status'],
          },
        },
      },
    })
    mailBody: ComposeMailBody,
  ): Promise<{userIds: string[]}> {
    const {attachments, subject, status, body, meta, extId} = mailBody;
    const messageFilter: Filter<Message> = {
      where: {
        id: messageId,
        threadId,
      },
    };
    if (extId) {
      Object.assign(messageFilter.where, {
        extId,
      });
    }

    const message = await this.messageRepository.findOne(messageFilter);

    if (!message) {
      throw new HttpErrors.NotFound('Inmail not found');
    }

    if (attachments?.length) {
      attachments.forEach(attachment => {
        attachment.extId = message.extId;
        attachment.extMetadata = message.extMetadata;
      });
    }

    if (meta?.length) {
      meta.forEach(m => {
        m.extId = message.extId;
        m.extMetadata = message.extMetadata;
      });
    }
    const transaction = await this.messageRepository.beginTransaction();
    try {
      const newMessage = await this.messageRepository.createRelational(
        {
          sender: this.getInMailIdentifierType(
            process.env.INMAIL_IDENTIFIER_TYPE,
          ),
          body,
          status,
          subject,
          extId,
          extMetadata: message.extMetadata,
          attachments,
          meta,
        },
        {transaction},
      );

      const senderGroup = new Group({
        party: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
        threadId,
        extId: message.extId,
        extMetadata: message.extMetadata,
        type: PartyTypeMarker.from,
        storage:
          status === StorageMarker.draft
            ? StorageMarker.draft
            : StorageMarker.send,
      });

      const receiverGroupWhere: Filter<Group> = {
        where: {
          threadId,
          messageId,
        },
      };

      if (!replyAll) {
        Object.assign(receiverGroupWhere.where, {
          party: message.sender,
        });
      } else {
        Object.assign(receiverGroupWhere.where, {
          party: {
            neq: this.getInMailIdentifierType(
              process.env.INMAIL_IDENTIFIER_TYPE,
            ),
          },
        });
      }
      const groups = await this.groupRepository.find(receiverGroupWhere);
      if (!groups?.length) {
        throw new HttpErrors.NotFound('Group not found');
      }
      const recipientGroupPromise: Promise<Group>[] = [
        this.groupRepository.create(senderGroup),
      ];
      groups.forEach(group => {
        delete group.id;
        group.messageId = String(newMessage.id);
        group.createdOn = new Date();
        group.type = PartyTypeMarker.to;
        group.storage =
          status === StorageMarker.draft
            ? StorageMarker.draft
            : StorageMarker.send;
        recipientGroupPromise.push(
          this.groupRepository.create(group, {transaction}),
        );
      });
      await Promise.all(recipientGroupPromise);
      await transaction.commit();
      return {
        userIds: groups.map(group => group.party),
      };
    } catch (error) {
      await transaction.rollback();
      throw new HttpErrors.UnprocessableEntity('Error replying email');
    }
  }
  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.ComposeMail])
  @patch('threads/{threadId}/forward', {
    summary: 'API provides interface to forward single message.',
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Message is forwarded to another recipient',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {$ref: ID_RESPONSE_SCHEMA},
          },
        },
      } as ResponseObject,
      [STATUS_CODE.FORBIDDEN]: {description: FORBIDDEN_ERROR_MESSAGE},
      [STATUS_CODE.BAD_REQUEST]: {description: NOT_FOUND_MESSAGE},
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
                }),
              },
              subject: {
                type: 'string',
              },
              body: {
                type: 'string',
              },
              attachments: {
                type: 'array',
                items: getModelSchemaRef(Attachment, {
                  partial: true,
                }),
              },
              meta: {
                type: 'array',
                items: getModelSchemaRef(Meta, {
                  partial: true,
                }),
              },
              status: {
                type: 'string',
              },
            },
            required: ['groups'],
          },
        },
      },
    })
    forwardMailBody: ForwardMailBody,
    @param.path.string('threadId') threadId: string,
  ) {
    const thread = await this.threadRepository.findOne({
      where: {
        id: threadId,
      },
    });
    if (!thread) {
      throw new HttpErrors.NotFound('Thread not found');
    }
    const createdOnBy = {
      createdBy: this.user.id,
      createdOn: new Date(),
    };
    const {groups, attachments, body, subject, status} = forwardMailBody;
    const transaction = await this.messageRepository.beginTransaction();
    const mail = await this.messageRepository.create(
      {
        sender: this.getInMailIdentifierType(
          process.env.INMAIL_IDENTIFIER_TYPE,
        ),
        threadId: thread.id,
        extId: thread.extId,
        extMetadata: {...thread.extMetadata, forwarded: true},
        status,
        body,
        subject,
      },
      {
        transaction,
      },
    );
    try {
      await Promise.all(
        groups.map(group => {
          // new group will be created on forward message
          Object.assign(group, createdOnBy);
          if (thread.extId) group.extId = thread.extId;
          if (thread.extMetadata) group.extMetadata = thread.extMetadata;
          Object.assign(group, {
            threadId: thread.id,
            messageId: mail.id,
          });
          return this.messageRepository.groups(mail.id).create(group, {
            transaction,
          });
        }),
      );
      if (attachments?.length) {
        await Promise.all(
          attachments.map(attachment => {
            // new group will be created on forward message
            Object.assign(attachment, createdOnBy);
            if (thread.extId) attachment.extId = thread.extId;
            if (thread.extId) attachment.extMetadata = thread.extMetadata;
            return this.messageRepository
              .attachments(mail.id)
              .create(attachment, {
                transaction,
              });
          }),
        );
      }
      await this.threadRepository.incrementOrCreate(
        thread.id,
        {},
        {transaction},
      );
      await transaction.commit();
      return {
        id: threadId,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.AddAttachments])
  @post('mails/{messageId}/attachments', {
    summary:
      'API provides an interface for adding attachment before message is sent.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'collect single attachment for user by message identifier',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'object',
              title: 'Attachment add response schema',
              properties: {
                items: {
                  type: 'array',
                  items: getModelSchemaRef(Attachment),
                },
              },
            },
          },
        },
      } as ResponseObject,
      [STATUS_CODE.FORBIDDEN]: {description: FORBIDDEN_ERROR_MESSAGE},
      [STATUS_CODE.BAD_REQUEST]: {description: NOT_FOUND_MESSAGE},
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
    @param.path.string('messageId') messageId: string,
    @param.query.object('filter') filter?: Partial<Message>,
  ): Promise<{
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
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.DeleteAttachment])
  @del('mails/{messageId}/attachments/{attachmentId}', {
    summary:
      'API provides an interface for removing attachment before message is sent',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Deletetion of Attachment Successful!',
      } as ResponseObject,
      [STATUS_CODE.FORBIDDEN]: {description: FORBIDDEN_ERROR_MESSAGE},
      [STATUS_CODE.NOT_FOUND]: {description: NOT_FOUND_MESSAGE},
    },
  })
  async removeAttachment(
    @param.path.string('messageId') messageId: string,
    @param.path.string('attachmentId') attachmentId: string,
    @param.query.object('filter') filter: Partial<Message>,
  ): Promise<{
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
    return {item: attachmentId};
  }
  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.TrashMail])
  @del('mails/bulk/{storage}/{action}', {
    summary: 'API for moving mails to trash and then delete',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Trash/Deletion of Mail(s) sucessful!',
      } as ResponseObject,
      [STATUS_CODE.FORBIDDEN]: {description: FORBIDDEN_ERROR_MESSAGE},
      [STATUS_CODE.NOT_FOUND]: {description: NOT_FOUND_MESSAGE},
    },
  })
  async trashBulk(
    @param.path.string('storage') storage: StorageMarker,
    @param.path.string('action') action: 'delete' | 'trash',
    @param.query.object('filter') filter: Partial<Group>,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(IdArrays, {
            partial: true,
          }),
        },
      },
    })
    body: IdArrays,
  ) {
    const {messageIds} = body;
    const groupWhere = {
      where: {
        storage,
        messageIds: {
          inq: {
            messageIds,
          },
        },
        party: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
      },
    };
    if (filter) {
      Object.assign(groupWhere.where, {
        ...filter,
      });
    }
    const groups = await this.groupRepository.find(groupWhere);
    const groupUpdatePromise: Promise<void>[] = [];
    if (!groups?.length) {
      throw new HttpErrors.NotFound('Group Not Found');
    }
    if (action === 'trash') {
      if (storage === StorageMarker.trash) {
        throw new HttpErrors.BadRequest('Mail is already in trash');
      }
      groups.forEach(group => {
        group.deleted = false;
        group.storage = StorageMarker.trash;
        group.modifiedOn = new Date();
        groupUpdatePromise.push(this.groupRepository.update(group));
      });
    }
    if (action === 'delete') {
      if (storage !== StorageMarker.trash) {
        throw new HttpErrors.BadRequest(
          'Mail must be in trash for permanent deletion',
        );
      }
      groups.forEach(group => {
        group.deleted = true;
        group.modifiedOn = new Date();
        groupUpdatePromise.push(this.groupRepository.update(group));
      });
    }
    await Promise.all(groupUpdatePromise);
    return {items: groups};
  }
  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.RestoreMail])
  @patch('mails/bulk/restore', {
    summary: 'API provides an interface for restore message from trash.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Restore Message Successful!',
      } as ResponseObject,
      [STATUS_CODE.FORBIDDEN]: {description: FORBIDDEN_ERROR_MESSAGE},
      [STATUS_CODE.BAD_REQUEST]: {description: NOT_FOUND_MESSAGE},
    },
  })
  async restore(
    @param.query.object('filter') filter: Partial<Group>,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(IdArrays, {
            partial: true,
          }),
        },
      },
    })
    body: IdArrays,
  ): Promise<{
    item: Group[];
  }> {
    const groupWhere = {
      where: {
        storage: {eq: StorageMarker.trash},
        messageId: {inq: body.messageIds},
        party: {
          eq: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
        },
      },
    };
    if (filter) {
      Object.assign(groupWhere.where, {
        ...filter,
      });
    }
    const groups = await this.groupRepository.find(groupWhere);
    if (!groups.length) {
      throw new HttpErrors.NotFound('Trashed Message not Found');
    }
    const groupsUpdatePromise: Promise<void>[] = [];
    groups.forEach(group => {
      if (
        [PartyTypeMarker.to, PartyTypeMarker.bcc, PartyTypeMarker.cc].includes(
          group.type,
        )
      ) {
        group.storage = StorageMarker.inbox;
      } else {
        group.storage = StorageMarker.send;
      }
      groupsUpdatePromise.push(this.groupRepository.update(group));
    });
    await Promise.all(groupsUpdatePromise);
    return {
      item: groups,
    };
  }
  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionsEnums.ComposeMail])
  @patch('mails/{messageId}/send', {
    summary: 'API for sending a drafted message.',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Mail is Successfully sent!',
      } as ResponseObject,
      [STATUS_CODE.FORBIDDEN]: {description: FORBIDDEN_ERROR_MESSAGE},
      [STATUS_CODE.BAD_REQUEST]: {description: NOT_FOUND_MESSAGE},
    },
  })
  async sendDraft(
    @param.path.string('messageId') messageId: string,
    @param.query.object('filter') filter: Partial<Message>,
  ): Promise<{
    id: string;
  }> {
    const messageFilter: Filter<Message> = {
      where: {
        id: messageId,
        status: StorageMarker.draft,
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
    const groups = await this.groupRepository.find({
      where: {
        messageId,
      },
    });
    await this.messageRepository.updateById(String(message.id), {
      status: StatusMarker.send,
    });
    const groupUpdatePromise: Promise<void>[] = [];
    groups.forEach(group => {
      if (group.type === PartyTypeMarker.from) {
        group.storage = StorageMarker.send;
      } else {
        group.storage = StorageMarker.inbox;
      }
      group.modifiedOn = new Date();
      groupUpdatePromise.push(this.groupRepository.update(group));
    });
    await Promise.all(groupUpdatePromise);
    return {id: messageId};
  }
}
