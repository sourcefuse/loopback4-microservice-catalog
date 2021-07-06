import {inject} from '@loopback/context';
import {
  getModelSchemaRef,
  param,
  patch,
  requestBody,
} from '@loopback/openapi-v3';
import {Filter, repository} from '@loopback/repository';
import {api, HttpErrors, ResponseObject} from '@loopback/rest';
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
import {Attachment, Group, IdResponse, Message, Meta} from '../models';
import {
  AttachmentRepository,
  GroupRepository,
  MessageRepository,
  ThreadRepository,
} from '../repositories';
import {PartyTypeMarker, PermissionsEnums, StorageMarker} from '../types';
import {
  ComposeMailBody,
  ForwardMailBody,
} from '../types/compose-mail-body.type';

const FORBIDDEN_ERROR_MESSAGE =
  'Forbidden request due to unauthorized token in header.';
const NOT_FOUND_MESSAGE = 'Message identity does not exist.';
const ID_RESPONSE_SCHEMA = '#/components/schemas/idResponse';

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
export class ReplyAndForwardController {
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
  @authorize({permissions: [PermissionsEnums.ReplyMail]})
  @patch('threads/{threadId}/mails/{messageId}/replies', {
    security: OPERATION_SECURITY_SPEC,
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
          threadId,
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
        messageId: String(newMessage.id),
        extId: message.extId,
        extMetadata: message.extMetadata,
        type: PartyTypeMarker.from,
        storage:
          status === StorageMarker.draft
            ? StorageMarker.draft
            : StorageMarker.send,
      });

      let receiverGroupWhere = `thread_id = '${threadId}'
      and message_id = '${messageId}'`;

      if (!replyAll) {
        receiverGroupWhere += ` and party = '${message.sender}'`;
      } else {
        const user = this.getInMailIdentifierType(
          process.env.INMAIL_IDENTIFIER_TYPE,
        );
        receiverGroupWhere += ` and party <> '${user}'`;
      }
      const groups: Group[] = (await this.groupRepository.execute(
        `SELECT party, thread_id as "threadId", type from main.group
      where ${receiverGroupWhere} `,
        [],
      )) as Group[];
      if (!groups.length) {
        throw new HttpErrors.NotFound('Group not found');
      }
      const recipientGroupPromise: Promise<Group>[] = [
        this.groupRepository.create(senderGroup),
      ];
      groups.forEach(group => {
        delete group.id;
        group.messageId = String(newMessage.id);
        group.createdOn = new Date();
        group.type =
          group.type === PartyTypeMarker.from ? PartyTypeMarker.to : group.type;
        group.storage = StorageMarker.inbox;
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
  @authorize({permissions: [PermissionsEnums.ComposeMail]})
  @patch('threads/{threadId}/forward', {
    security: OPERATION_SECURITY_SPEC,
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
    const {attachments, body, subject, status} = forwardMailBody;
    let {groups} = forwardMailBody;
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
        createdBy: this.user.id,
      },
      {
        transaction,
      },
    );
    try {
      const senderGroup = new Group({
        party: this.getInMailIdentifierType(process.env.INMAIL_IDENTIFIER_TYPE),
        threadId,
        messageId: String(mail.id),
        extId: mail.extId,
        extMetadata: mail.extMetadata,
        type: PartyTypeMarker.from,
        storage:
          status === StorageMarker.draft
            ? StorageMarker.draft
            : StorageMarker.send,
      });
      groups = groups.concat(senderGroup);
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
}
