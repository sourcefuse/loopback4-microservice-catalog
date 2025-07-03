// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {
  getModelSchemaRef,
  param,
  patch,
  put,
  requestBody,
} from '@loopback/openapi-v3';
import {DataObject, Filter, repository} from '@loopback/repository';
import {HttpErrors, ResponseObject, api, del, post} from '@loopback/rest';
import {
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {
  AuthenticationBindings,
  STRATEGY,
  authenticate,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {
  Attachment,
  Group,
  IdArrays,
  IdResponse,
  Message,
  Meta,
  StatusMarker,
} from '../models';
import {
  AttachmentRepository,
  GroupRepository,
  MessageRepository,
  ThreadRepository,
} from '../repositories';
import {
  PartyTypeMarker,
  PermissionsEnums,
  StorageMarker,
  VisibilityMarker,
} from '../types';
import {ComposeMailBody} from '../types/compose-mail-body.type';

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
  @authorize({
    permissions: [
      PermissionsEnums.ComposeMail,
      PermissionsEnums.ComposeMailNum,
    ],
  })
  @post('/mails', {
    security: OPERATION_SECURITY_SPEC,
    summary: 'ComposeAPI. For drafting, reply on and create new message',
    responses: {
      [STATUS_CODE.CREATED]: {
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
      meta,
      attachments,
      status,
      subject,
      body,
      threadId,
      isImportant,
    } = composeMailBody;
    let {groups, extMetadata} = composeMailBody;
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
    const transaction = await this.messageRepository.beginTransaction();
    try {
      if (status === StorageMarker.draft) {
        if (!extMetadata) {
          extMetadata = {
            markedTo: groups,
          };
        } else {
          extMetadata.markedTo = groups;
        }
        groups = [];
      }
      groups.forEach(group => {
        group.threadId = thread.id;
        group.extId = extId;
        group.extMetadata = extMetadata;
        group.isImportant = isImportant;
        group.storage = StorageMarker.inbox;
      });
      groups = groups.concat([
        new Group({
          party: this.getInMailIdentifierType(
            process.env.INMAIL_IDENTIFIER_TYPE,
          ),
          type: PartyTypeMarker.from,
          threadId: thread.id,
          extId: extId,
          isImportant: isImportant,
          visibility: VisibilityMarker.read,
          extMetadata: extMetadata,
          storage:
            status === StorageMarker.draft
              ? StorageMarker.draft
              : StorageMarker.send,
        }),
      ]);

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
      const mail = await this.messageRepository.createRelational({
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
        group: groups,
        meta: meta,
        attachments,
      });
      await transaction.commit();
      return {id: mail.id};
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionsEnums.UpdateMail, PermissionsEnums.UpdateMailNum],
  })
  @put('/mails/{messageId}', {
    security: OPERATION_SECURITY_SPEC,
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
    const {extId, subject, body, status} = composeMailBody;
    let {extMetadata} = composeMailBody;
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
    await Promise.all([
      this.messageRepository
        .attachments(messageId)
        .patch({deleted: true}, {}, {transaction}),
      this.messageRepository
        .meta(messageId)
        .patch({deleted: true}, {}, {transaction}),
      this.messageRepository
        .groups(messageId)
        .patch({deleted: true}, {}, {transaction}),
    ]);
    // Root id is not allowed to update
    const createdOnBy = {
      createdBy: this.user.id,
      createdOn: new Date(),
    };
    let groups: Group[] = [];
    if (status === StorageMarker.draft) {
      extMetadata ??= {};
      extMetadata.markedTo = composeMailBody.groups;
    } else {
      groups = composeMailBody.groups.map(e => {
        Object.assign(e, createdOnBy);
        e.extId = extId;
        e.storage = StorageMarker.inbox;
        e.extMetadata = extMetadata;
        e.threadId = mail.threadId;
        return new Group(e);
      });
    }
    groups.push(
      new Group({
        party: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
        type: PartyTypeMarker.from,
        extId: extId,
        extMetadata,
        threadId: mail.threadId,
        ...createdOnBy,
        storage:
          status === StorageMarker.draft
            ? StorageMarker.draft
            : StorageMarker.send,
      }),
    );
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
      ...(subject && {subject}),
      ...(body && {body}),
    };

    await this.messageRepository.updateById(messageId, messageUpdateData);
    await Promise.all([
      ...attachments.map(att =>
        this.messageRepository.attachments(mail.id).create(att, {transaction}),
      ),
      ...groups.map(grp =>
        this.messageRepository.groups(mail.id).create(grp, {transaction}),
      ),
      ...meta.map(m =>
        this.messageRepository.meta(mail.id).create(m, {transaction}),
      ),
    ]);
    await transaction.commit();
    return {
      id: mail.id,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionsEnums.AddAttachments,
      PermissionsEnums.AddAttachmentsNum,
    ],
  })
  @post('/mails/{messageId}/attachments', {
    security: OPERATION_SECURITY_SPEC,
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
    if (filter && messageFilter.where) {
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
  @authorize({
    permissions: [
      PermissionsEnums.DeleteAttachment,
      PermissionsEnums.DeleteAttachmentNum,
    ],
  })
  @del('/mails/{messageId}/attachments/{attachmentId}', {
    security: OPERATION_SECURITY_SPEC,
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
    if (filter && messageFilter.where) {
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
  @authorize({
    permissions: [PermissionsEnums.TrashMail, PermissionsEnums.TrashMailNum],
  })
  @del('/mails/bulk/{storage}/{action}', {
    security: OPERATION_SECURITY_SPEC,
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
    if (!messageIds?.length) {
      throw new HttpErrors.BadRequest('No messageIds provided');
    }
    const groupWhere = this._buildGroupWhereClause(storage, messageIds);
    const groups = await this.groupRepository.find(groupWhere);
    if (!groups?.length) {
      throw new HttpErrors.NotFound('Group Not Found');
    }

    await this._processActionOnGroups(action, storage, groups);
    return {items: groups};
  }
  private _buildGroupWhereClause(storage: StorageMarker, messageIds: string[]) {
    return {
      where: {
        storage,
        messageId: {inq: messageIds},
        party: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
      },
    };
  }
  /**
   * The function `_processActionOnGroups` processes either a 'delete' or 'trash' action on groups
   * based on the specified storage marker.
   * @param {'delete' | 'trash'} action - The `action` parameter in the `_processActionOnGroups` method
   * specifies the type of action to be performed on the groups. It can have two possible values:
   * 'delete' or 'trash'.
   * @param {StorageMarker} storage - The `storage` parameter in the `_processActionOnGroups` method is
   * of type `StorageMarker`. It is used to specify the storage marker for the groups being processed.
   * @param {Group[]} groups - The `groups` parameter in the `_processActionOnGroups` method is an
   * array of `Group` objects.
   */
  private async _processActionOnGroups(
    action: 'delete' | 'trash',
    storage: StorageMarker,
    groups: Group[],
  ): Promise<void> {
    switch (action) {
      case 'trash':
        this._validateTrashAction(storage);
        await this._updateGroups(groups, StorageMarker.trash, false);
        break;

      case 'delete':
        this._validateDeleteAction(storage);
        await this._updateGroups(groups, storage, true);
        break;

      default:
        throw new HttpErrors.BadRequest('Invalid action');
    }
  }

  /**
   * The function `_validateTrashAction` checks if a mail is already in trash or if it can only be
   * deleted from the Draft storage.
   * @param {StorageMarker} storage - The `storage` parameter is a marker that indicates the current
   * storage location of a mail message. It can have values such as `StorageMarker.trash` or
   * `StorageMarker.draft`.
   */
  private _validateTrashAction(storage: StorageMarker): void {
    if (storage === StorageMarker.trash) {
      throw new HttpErrors.BadRequest('Mail is already in trash');
    }
    if (storage === StorageMarker.draft) {
      throw new HttpErrors.BadRequest('Can only delete the messages in Draft');
    }
  }

  /* The above code snippet is from a TypeScript class and contains two methods. */
  private _validateDeleteAction(storage: StorageMarker): void {
    if (![StorageMarker.trash, StorageMarker.draft].includes(storage)) {
      throw new HttpErrors.BadRequest(
        'Mail must be in trash or draft for permanent deletion',
      );
    }
  }

  /**
   * The function `_updateGroups` asynchronously updates an array of Group objects with specified
   * storage marker and deletion status.
   * @param {Group[]} groups - An array of Group objects that need to be updated.
   * @param {StorageMarker} storage - The `storage` parameter in the `_updateGroups` function is of
   * type `StorageMarker`. It is used to determine the storage location for the groups being updated.
   * @param {boolean} deleted - The `deleted` parameter is a boolean flag that indicates whether the
   * groups should be marked as deleted or not. If `deleted` is true, the groups will be marked as
   * deleted and their storage location will be updated to the specified `storage` marker.
   */
  private async _updateGroups(
    groups: Group[],
    storage: StorageMarker,
    deleted: boolean,
  ): Promise<void> {
    const promises = groups.map(group => {
      group.deleted = deleted;
      group.storage = deleted ? group.storage : storage;
      group.modifiedOn = new Date();
      return this.groupRepository.update(group);
    });
    await Promise.all(promises);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionsEnums.RestoreMail,
      PermissionsEnums.RestoreMailNum,
    ],
  })
  @patch('/mails/bulk/restore', {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({
    permissions: [
      PermissionsEnums.ComposeMail,
      PermissionsEnums.ComposeMailNum,
    ],
  })
  @patch('/mails/{messageId}/send', {
    security: OPERATION_SECURITY_SPEC,
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
    to: Array<object>;
  }> {
    const messageFilter: Filter<Message> = {
      where: {
        id: messageId,
        status: StorageMarker.draft,
      },
    };
    if (filter && messageFilter.where) {
      Object.assign(messageFilter.where, {
        ...filter,
      });
    }
    const message = await this.messageRepository.findOne(messageFilter);
    if (!message) {
      throw new HttpErrors.NotFound(NOT_FOUND_MESSAGE);
    }
    let groups = await this.groupRepository.find({
      where: {
        messageId,
      },
    });
    if (message.extMetadata?.markedTo) {
      groups = groups.concat(message.extMetadata?.markedTo);
    }
    await this.messageRepository.updateById(String(message.id), {
      status: StatusMarker.send,
    });
    const groupUpdatePromise: Promise<void>[] = [];
    const groupCreatePromise: Promise<Group>[] = [];
    groups.forEach(group => {
      if (group.type === PartyTypeMarker.from) {
        group.storage = StorageMarker.send;
        group.modifiedOn = new Date();
        groupUpdatePromise.push(this.groupRepository.update(group));
      } else {
        group.storage = StorageMarker.inbox;
        group.messageId = String(message.id);
        group.threadId = message.threadId;
        group.extId = message.extId;
        groupCreatePromise.push(this.groupRepository.create(group));
      }
    });
    await Promise.all(groupUpdatePromise);
    await Promise.all(groupCreatePromise);
    return {
      id: messageId,
      to: message.extMetadata?.markedTo,
    };
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionsEnums.UpdateMail, PermissionsEnums.UpdateMailNum],
  })
  @patch('/mails/marking/{markType}', {
    security: OPERATION_SECURITY_SPEC,
    summary: 'API provides interface to mark read, unread and important',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message is marked read/unread/important',
      },
    },
  })
  async markMail(
    @param.path.string('markType') markType: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(IdArrays, {
            partial: true,
          }),
        },
      },
    })
    idArray: IdArrays,
  ) {
    const party =
      process.env.INMAIL_IDENTIFIER_TYPE === 'user'
        ? this.user.id
        : this.user.email;

    const filters = {
      message: {
        messageId: {inq: idArray.messageIds ?? []},
        party,
      },
      thread: {
        threadId: {inq: idArray.threadIds ?? []},
        party,
      },
    };

    const updateAll = async (updateObj: Partial<Group>) => {
      const promises: Promise<unknown>[] = [];

      if (idArray.messageIds?.length) {
        promises.push(
          this.groupRepository.updateAll(updateObj, filters.message),
        );
      }
      if (idArray.threadIds?.length) {
        promises.push(
          this.groupRepository.updateAll(updateObj, filters.thread),
        );
      }

      await Promise.all(promises);
    };

    switch (markType) {
      case VisibilityMarker.read:
        await updateAll({visibility: VisibilityMarker.read});
        break;

      case VisibilityMarker.unread:
        await updateAll({visibility: VisibilityMarker.unread});
        break;

      case VisibilityMarker.important:
        await this.groupRepository.updateAll(
          {isImportant: true},
          filters.message,
        );
        break;

      case VisibilityMarker.NotImportant:
        await this.groupRepository.updateAll(
          {isImportant: false},
          filters.message,
        );
        break;

      default:
        throw new HttpErrors.BadRequest('Invalid markType');
    }

    return {success: true};
  }
}
