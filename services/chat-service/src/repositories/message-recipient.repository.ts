import {juggler, repository, BelongsToAccessor} from '@loopback/repository';
import {MessageRecipient, MessageRecipientRelations, Message} from '../models';
import {Getter, inject} from '@loopback/core';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {MessageRepository} from './message.repository';

export class MessageRecipientRepository extends DefaultUserModifyCrudRepository<
  MessageRecipient,
  typeof MessageRecipient.prototype.id,
  MessageRecipientRelations
> {
  public readonly message: BelongsToAccessor<
    Message,
    typeof MessageRecipient.prototype.id
  >;

  constructor(
    @inject('datasources.chatDb') dataSource: juggler.DataSource,
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
