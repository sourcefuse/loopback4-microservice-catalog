// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  Message,
  MessageRecipient,
  MessageRecipientRelations,
} from '../../models';
import {MessageRepository} from './message.repository';

export class MessageRecipientRepository extends SequelizeUserModifyCrudRepository<
  MessageRecipient,
  typeof MessageRecipient.prototype.id,
  MessageRecipientRelations
> {
  public readonly message: BelongsToAccessor<
    Message,
    typeof MessageRecipient.prototype.id
  >;

  constructor(
    @inject('datasources.chatDb') dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('MessageRepository')
    protected messageRepositoryGetter: Getter<MessageRepository>,
  ) {
    super(MessageRecipient, dataSource, getCurrentUser);

    this.message = this.createBelongsToAccessorFor(
      'message',
      messageRepositoryGetter,
    );
    this.registerInclusionResolver('message', this.message.inclusionResolver);
  }
}
