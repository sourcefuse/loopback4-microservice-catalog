import { UserModifiableEntity } from '@sourceloop/core';
import { MessageRecipient } from './message-recipient.model';
export declare class Message extends UserModifiableEntity {
    id?: string;
    body: string;
    channelId: string;
    channelType: string;
    status?: number;
    subject?: string;
    toUserId?: string;
    messageRecipients: MessageRecipient[];
    parentMessageId: string;
    messages: Message[];
    constructor(data?: Partial<Message>);
}
export interface MessageRelations {
    messages: MessageWithRelations[];
    messageRecipients: MessageRecipient;
    parentMessage: MessageWithRelations;
}
export declare type MessageWithRelations = Message & MessageRelations;
