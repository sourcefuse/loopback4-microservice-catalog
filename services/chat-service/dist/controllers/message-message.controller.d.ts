import { Count, Filter, Where } from '@loopback/repository';
import { Message } from '../models';
import { MessageRepository } from '../repositories';
export declare class MessageMessageController {
    protected messageRepository: MessageRepository;
    constructor(messageRepository: MessageRepository);
    find(id: string, filter?: Filter<Message>): Promise<Message[]>;
    create(id: typeof Message.prototype.id, message: Omit<Message, 'id'>): Promise<Message>;
    patch(id: string, message: Partial<Message>, where?: Where<Message>): Promise<Count>;
    delete(id: string, where?: Where<Message>): Promise<Count>;
}
