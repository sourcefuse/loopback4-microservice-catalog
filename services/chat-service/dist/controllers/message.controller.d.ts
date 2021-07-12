import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Message } from '../models';
import { MessageRepository } from '../repositories';
export declare class MessageController {
    messageRepository: MessageRepository;
    constructor(messageRepository: MessageRepository);
    create(message: Omit<Message, 'id'>): Promise<Message>;
    count(where?: Where<Message>): Promise<Count>;
    find(filter?: Filter<Message>): Promise<Message[]>;
    updateAll(message: Message, where?: Where<Message>): Promise<Count>;
    findById(id: string, filter?: FilterExcludingWhere<Message>): Promise<Message>;
    updateById(id: string, message: Message): Promise<void>;
    replaceById(id: string, message: Message): Promise<void>;
    deleteById(id: string): Promise<void>;
}
