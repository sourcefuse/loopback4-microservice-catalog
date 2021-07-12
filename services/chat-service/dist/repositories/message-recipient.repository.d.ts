import { juggler, BelongsToAccessor } from '@loopback/repository';
import { MessageRecipient, MessageRecipientRelations, Message } from '../models';
import { Getter } from '@loopback/core';
import { DefaultUserModifyCrudRepository, IAuthUserWithPermissions } from '@sourceloop/core';
import { MessageRepository } from './message.repository';
export declare class MessageRecipientRepository extends DefaultUserModifyCrudRepository<MessageRecipient, typeof MessageRecipient.prototype.id, MessageRecipientRelations> {
    protected readonly getCurrentUser: Getter<IAuthUserWithPermissions | undefined>;
    protected messageRepositoryGetter: Getter<MessageRepository>;
    readonly message: BelongsToAccessor<Message, typeof MessageRecipient.prototype.id>;
    constructor(dataSource: juggler.DataSource, getCurrentUser: Getter<IAuthUserWithPermissions | undefined>, messageRepositoryGetter: Getter<MessageRepository>);
}
