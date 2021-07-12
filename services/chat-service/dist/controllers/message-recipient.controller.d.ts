import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { MessageRecipient } from '../models';
import { MessageRecipientRepository } from '../repositories';
export declare class MessageRecipientController {
    messageRecipientRepository: MessageRecipientRepository;
    constructor(messageRecipientRepository: MessageRecipientRepository);
    create(messageRecipient: Omit<MessageRecipient, 'id'>): Promise<MessageRecipient>;
    count(where?: Where<MessageRecipient>): Promise<Count>;
    find(filter?: Filter<MessageRecipient>): Promise<MessageRecipient[]>;
    updateAll(messageRecipient: MessageRecipient, where?: Where<MessageRecipient>): Promise<Count>;
    findById(id: string, filter?: FilterExcludingWhere<MessageRecipient>): Promise<MessageRecipient>;
    updateById(id: string, messageRecipient: MessageRecipient): Promise<void>;
    replaceById(id: string, messageRecipient: MessageRecipient): Promise<void>;
    deleteById(id: string): Promise<void>;
}
