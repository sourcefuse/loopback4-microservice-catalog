// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {DataObject, Options, repository} from '@loopback/repository';

import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  Attachment,
  Group,
  Message,
  MessageWithRelations,
  Meta,
} from '../models';
import {MessageRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class MessageHelperService {
  constructor(
    @repository(MessageRepository)
    public messageRepository: MessageRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {}

  async createRelational(
    entity: DataObject<MessageWithRelations>,
    options?: Options,
  ): Promise<Message> {
    const transaction = await this.messageRepository.beginTransaction();
    const extractedEntity = (({
      meta = [],
      attachments = [],
      group = [],
      ...o
    }) => ({meta, attachments, group, message: o}))(entity);
    try {
      const currentUser = await this.getCurrentUser();
      const createdOnBy = {
        createdBy: currentUser?.id,
        createdOn: new Date(),
      };

      const transactionOptions = {...options, transaction};

      Object.assign(extractedEntity.message, createdOnBy);
      const message = await this.messageRepository.create(
        extractedEntity.message,
      );

      if (entity.group) {
        await Promise.all(
          (entity.group as Array<Group>).map(group => {
            Object.assign(group, createdOnBy);
            return this.messageRepository
              .groups(message.id)
              .create(group, transactionOptions);
          }),
        );
      }
      if (entity.meta) {
        await Promise.all(
          (entity.meta as Array<Meta>).map(meta => {
            Object.assign(meta, createdOnBy);
            return this.messageRepository
              .meta(message.id)
              .create(meta, transactionOptions);
          }),
        );
      }
      if (entity.attachments) {
        await Promise.all(
          (entity.attachments as Array<Attachment>).map(attachment => {
            Object.assign(attachment, createdOnBy);
            return this.messageRepository
              .attachments(message.id)
              .create(attachment, transactionOptions);
          }),
        );
      }
      await transaction.commit();
      return message;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }
}
