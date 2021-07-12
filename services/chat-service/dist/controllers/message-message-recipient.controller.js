"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMessageRecipientController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const core_1 = require("@sourceloop/core");
const loopback4_authentication_1 = require("loopback4-authentication");
const loopback4_authorization_1 = require("loopback4-authorization");
const enums_1 = require("../enums");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const basePath = '/messages/{id}/message-recipients';
let MessageMessageRecipientController = class MessageMessageRecipientController {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async find(id, filter) {
        return this.messageRepository.messageRecipients(id).find(filter);
    }
    async create(id, messageRecipient) {
        return this.messageRepository
            .messageRecipients(id)
            .create(messageRecipient);
    }
    async patch(id, messageRecipient, where) {
        return this.messageRepository
            .messageRecipients(id)
            .patch(messageRecipient, where);
    }
    async delete(id, where) {
        return this.messageRepository.messageRecipients(id).delete(where);
    }
};
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.ViewMessageRecipient] }),
    rest_1.get(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Array of Message has many MessageRecipient',
                content: {
                    [core_1.CONTENT_TYPE.JSON]: {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.MessageRecipient) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('filter')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageMessageRecipientController.prototype, "find", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.CreateMessageRecipient] }),
    rest_1.post(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Message model instance',
                content: {
                    [core_1.CONTENT_TYPE.JSON]: { schema: rest_1.getModelSchemaRef(models_1.MessageRecipient) },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            [core_1.CONTENT_TYPE.JSON]: {
                schema: rest_1.getModelSchemaRef(models_1.MessageRecipient, {
                    title: 'NewMessageRecipientInMessage',
                    exclude: ['id'],
                    optional: ['messageId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageMessageRecipientController.prototype, "create", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.UpdateMessageRecipient] }),
    rest_1.patch(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Message.MessageRecipient PATCH success count',
                content: { [core_1.CONTENT_TYPE.JSON]: { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            [core_1.CONTENT_TYPE.JSON]: {
                schema: rest_1.getModelSchemaRef(models_1.MessageRecipient, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.MessageRecipient))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageMessageRecipientController.prototype, "patch", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.DeleteMessageRecipient] }),
    rest_1.del(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Message.MessageRecipient DELETE success count',
                content: { [core_1.CONTENT_TYPE.JSON]: { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.MessageRecipient))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageMessageRecipientController.prototype, "delete", null);
MessageMessageRecipientController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.MessageRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MessageRepository])
], MessageMessageRecipientController);
exports.MessageMessageRecipientController = MessageMessageRecipientController;
//# sourceMappingURL=message-message-recipient.controller.js.map