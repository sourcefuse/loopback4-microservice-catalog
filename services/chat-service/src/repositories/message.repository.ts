import {Message, MessageRelations, MessageRecipient} from '../models';
import {
  juggler,
  repository,
  HasManyRepositoryFactory,
  BelongsToAccessor,
} from '@loopback/repository';
import {Getter, inject} from '@loopback/core';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {MessageRecipientRepository} from './message-recipient.repository';

export class MessageRepository extends DefaultUserModifyCrudRepository<
  Message,
  typeof Message.prototype.id,
  MessageRelations
> {
  public readonly messageRecipients: HasManyRepositoryFactory<
    MessageRecipient,
    typeof Message.prototype.id
  >;

  public readonly parentMessage: BelongsToAccessor<
    Message,
    typeof Message.prototype.id
  >;

  public readonly messages: HasManyRepositoryFactory<
    Message,
    typeof Message.prototype.id
  >;

  constructor(
    @inject('datasources.chatDb') dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('MessageRecipientRepository')
    protected messageRecipientRepositoryGetter: Getter<MessageRecipientRepository>,
    @repository.getter('MessageRepository')
    protected messageRepositoryGetter: Getter<MessageRepository>,
  ) {
    super(Message, dataSource, getCurrentUser);

    this.messages = this.createHasManyRepositoryFactoryFor(
      'messages',
      messageRepositoryGetter,
    );
    this.registerInclusionResolver('messages', this.messages.inclusionResolver);

    this.parentMessage = this.createBelongsToAccessorFor(
      'parentMessage',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'parentMessage',
      this.parentMessage.inclusionResolver,
    );

    this.messageRecipients = this.createHasManyRepositoryFactoryFor(
      'messageRecipients',
      messageRecipientRepositoryGetter,
    );
    this.registerInclusionResolver(
      'messageRecipients',
      this.messageRecipients.inclusionResolver,
    );
  }
}
