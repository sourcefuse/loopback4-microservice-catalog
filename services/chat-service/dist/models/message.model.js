"use strict";
var Message_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const core_1 = require("@sourceloop/core");
const message_recipient_model_1 = require("./message-recipient.model");
let Message = Message_1 = class Message extends core_1.UserModifiableEntity {
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
], Message.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "body", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        name: 'channel_id',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "channelId", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        name: 'channel_type',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "channelType", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Message.prototype, "status", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "subject", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        name: 'to_user_id',
    }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "toUserId", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => message_recipient_model_1.MessageRecipient, { keyTo: 'messageId' }),
    tslib_1.__metadata("design:type", Array)
], Message.prototype, "messageRecipients", void 0);
tslib_1.__decorate([
    repository_1.belongsTo(() => Message_1, { name: 'parentMessage' }, { name: 'parent_message_id' }),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "parentMessageId", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => Message_1, { keyTo: 'parentMessageId' }),
    tslib_1.__metadata("design:type", Array)
], Message.prototype, "messages", void 0);
Message = Message_1 = tslib_1.__decorate([
    repository_1.model({
        name: 'messages',
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Message);
exports.Message = Message;
//# sourceMappingURL=message.model.js.map