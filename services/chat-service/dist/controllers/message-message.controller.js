"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMessageController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const core_1 = require("@sourceloop/core");
const loopback4_authentication_1 = require("loopback4-authentication");
const loopback4_authorization_1 = require("loopback4-authorization");
const enums_1 = require("../enums");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const basePath = '/messages/{id}/messages';
let MessageMessageController = class MessageMessageController {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async find(id, filter) {
        return this.messageRepository.messages(id).find(filter);
    }
    async create(id, message) {
        return this.messageRepository.messages(id).create(message);
    }
    async patch(id, message, where) {
        return this.messageRepository.messages(id).patch(message, where);
    }
    async delete(id, where) {
        return this.messageRepository.messages(id).delete(where);
    }
};
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.ViewMessage] }),
    rest_1.get(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Array of Message has many Message',
                content: {
                    [core_1.CONTENT_TYPE.JSON]: {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.Message) },
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
], MessageMessageController.prototype, "find", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.CreateMessage] }),
    rest_1.post(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Message model instance',
                content: { [core_1.CONTENT_TYPE.JSON]: { schema: rest_1.getModelSchemaRef(models_1.Message) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        security: core_1.OPERATION_SECURITY_SPEC,
        content: {
            [core_1.CONTENT_TYPE.JSON]: {
                schema: rest_1.getModelSchemaRef(models_1.Message, {
                    title: 'NewMessageInMessage',
                    exclude: ['id'],
                    optional: ['parentMessageId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageMessageController.prototype, "create", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.UpdateMessage] }),
    rest_1.patch(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Message.Message PATCH success count',
                content: { [core_1.CONTENT_TYPE.JSON]: { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            [core_1.CONTENT_TYPE.JSON]: {
                schema: rest_1.getModelSchemaRef(models_1.Message, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Message))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageMessageController.prototype, "patch", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.DeleteMessage] }),
    rest_1.del(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Message.Message DELETE success count',
                content: { [core_1.CONTENT_TYPE.JSON]: { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', rest_1.getWhereSchemaFor(models_1.Message))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageMessageController.prototype, "delete", null);
MessageMessageController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.MessageRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MessageRepository])
], MessageMessageController);
exports.MessageMessageController = MessageMessageController;
//# sourceMappingURL=message-message.controller.js.map