import { Message, MessageRecipient } from '../models';
import { MessageRecipientRepository } from '../repositories';
export declare class MessageRecipientMessageController {
    messageRecipientRepository: MessageRecipientRepository;
    constructor(messageRecipientRepository: MessageRecipientRepository);
    getMessage(id: typeof MessageRecipient.prototype.id): Promise<Message>;
}
