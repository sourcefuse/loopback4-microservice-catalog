import { Count, Filter, Where } from '@loopback/repository';
import { Message, MessageRecipient } from '../models';
import { MessageRepository } from '../repositories';
export declare class MessageMessageRecipientController {
    protected messageRepository: MessageRepository;
    constructor(messageRepository: MessageRepository);
    find(id: string, filter?: Filter<MessageRecipient>): Promise<MessageRecipient[]>;
    create(id: typeof Message.prototype.id, messageRecipient: Omit<MessageRecipient, 'id'>): Promise<MessageRecipient>;
    patch(id: string, messageRecipient: Partial<MessageRecipient>, where?: Where<MessageRecipient>): Promise<Count>;
    delete(id: string, where?: Where<MessageRecipient>): Promise<Count>;
}
