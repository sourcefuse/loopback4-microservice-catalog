import { UserModifiableEntity } from '@sourceloop/core';
import { MessageWithRelations } from './message.model';
export declare class MessageRecipient extends UserModifiableEntity {
    id?: string;
    channelId: string;
    forwardedBy?: string;
    isFavorite?: boolean;
    isForwarded?: boolean;
    isRead?: boolean;
    recipientId: string;
    messageId: string;
    constructor(data?: Partial<MessageRecipient>);
}
export interface MessageRecipientRelations {
    message: MessageWithRelations;
}
export declare type MessageRecipientWithRelations = MessageRecipient & MessageRecipientRelations;
