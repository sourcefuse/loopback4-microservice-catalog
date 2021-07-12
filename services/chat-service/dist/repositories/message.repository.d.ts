import { Message, MessageRelations, MessageRecipient } from '../models';
import { juggler, HasManyRepositoryFactory, BelongsToAccessor } from '@loopback/repository';
import { Getter } from '@loopback/core';
import { DefaultUserModifyCrudRepository, IAuthUserWithPermissions } from '@sourceloop/core';
import { MessageRecipientRepository } from './message-recipient.repository';
export declare class MessageRepository extends DefaultUserModifyCrudRepository<Message, typeof Message.prototype.id, MessageRelations> {
    protected readonly getCurrentUser: Getter<IAuthUserWithPermissions | undefined>;
    protected messageRecipientRepositoryGetter: Getter<MessageRecipientRepository>;
    protected messageRepositoryGetter: Getter<MessageRepository>;
    readonly messageRecipients: HasManyRepositoryFactory<MessageRecipient, typeof Message.prototype.id>;
    readonly parentMessage: BelongsToAccessor<Message, typeof Message.prototype.id>;
    readonly messages: HasManyRepositoryFactory<Message, typeof Message.prototype.id>;
    constructor(dataSource: juggler.DataSource, getCurrentUser: Getter<IAuthUserWithPermissions | undefined>, messageRecipientRepositoryGetter: Getter<MessageRecipientRepository>, messageRepositoryGetter: Getter<MessageRepository>);
}
