"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRecipient = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const core_1 = require("@sourceloop/core");
const message_model_1 = require("./message.model");
let MessageRecipient = class MessageRecipient extends core_1.UserModifiableEntity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", String)
], MessageRecipient.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        name: 'channel_id',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], MessageRecipient.prototype, "channelId", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        name: 'forwarded_by',
    }),
    tslib_1.__metadata("design:type", String)
], MessageRecipient.prototype, "forwardedBy", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        name: 'is_favorite',
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], MessageRecipient.prototype, "isFavorite", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        name: 'is_forwarded',
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], MessageRecipient.prototype, "isForwarded", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'boolean',
        name: 'is_read',
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], MessageRecipient.prototype, "isRead", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        name: 'recipient_id',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], MessageRecipient.prototype, "recipientId", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => message_model_1.Message, { name: 'message' }, { name: 'message_id', required: true }),
    tslib_1.__metadata("design:type", String)
], MessageRecipient.prototype, "messageId", void 0);
MessageRecipient = tslib_1.__decorate([
    repository_1.model({
        name: 'message_recipients',
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], MessageRecipient);
exports.MessageRecipient = MessageRecipient;
//# sourceMappingURL=message-recipient.model.js.map