"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRecipientController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const core_1 = require("@sourceloop/core");
const loopback4_authentication_1 = require("loopback4-authentication");
const loopback4_authorization_1 = require("loopback4-authorization");
const enums_1 = require("../enums");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const basePath = '/message-recipients';
let MessageRecipientController = class MessageRecipientController {
    constructor(messageRecipientRepository) {
        this.messageRecipientRepository = messageRecipientRepository;
    }
    async create(messageRecipient) {
        return this.messageRecipientRepository.create(messageRecipient);
    }
    async count(where) {
        return this.messageRecipientRepository.count(where);
    }
    async find(filter) {
        return this.messageRecipientRepository.find(filter);
    }
    async updateAll(messageRecipient, where) {
        return this.messageRecipientRepository.updateAll(messageRecipient, where);
    }
    async findById(id, filter) {
        return this.messageRecipientRepository.findById(id, filter);
    }
    async updateById(id, messageRecipient) {
        await this.messageRecipientRepository.updateById(id, messageRecipient);
    }
    async replaceById(id, messageRecipient) {
        await this.messageRecipientRepository.replaceById(id, messageRecipient);
    }
    async deleteById(id) {
        await this.messageRecipientRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.CreateMessageRecipient] }),
    rest_1.post(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'MessageRecipient model instance',
                content: {
                    [core_1.CONTENT_TYPE.JSON]: { schema: rest_1.getModelSchemaRef(models_1.MessageRecipient) },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.requestBody({
        content: {
            [core_1.CONTENT_TYPE.JSON]: {
                schema: rest_1.getModelSchemaRef(models_1.MessageRecipient, {
                    title: 'NewMessageRecipient',
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageRecipientController.prototype, "create", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.ViewMessageRecipient] }),
    rest_1.get(`${basePath}/count`, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'MessageRecipient model count',
                content: { [core_1.CONTENT_TYPE.JSON]: { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.MessageRecipient)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageRecipientController.prototype, "count", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.ViewMessageRecipient] }),
    rest_1.get(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Array of MessageRecipient model instances',
                content: {
                    [core_1.CONTENT_TYPE.JSON]: {
                        schema: {
                            type: 'array',
                            items: rest_1.getModelSchemaRef(models_1.MessageRecipient, {
                                includeRelations: true,
                            }),
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.MessageRecipient)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageRecipientController.prototype, "find", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.UpdateMessageRecipient] }),
    rest_1.patch(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'MessageRecipient PATCH success count',
                content: { [core_1.CONTENT_TYPE.JSON]: { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.requestBody({
        content: {
            [core_1.CONTENT_TYPE.JSON]: {
                schema: rest_1.getModelSchemaRef(models_1.MessageRecipient, { partial: true }),
            },
        },
    })),
    tslib_1.__param(1, rest_1.param.where(models_1.MessageRecipient)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.MessageRecipient, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageRecipientController.prototype, "updateAll", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.ViewMessageRecipient] }),
    rest_1.get(`${basePath}/{id}`, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'MessageRecipient model instance',
                content: {
                    [core_1.CONTENT_TYPE.JSON]: {
                        schema: rest_1.getModelSchemaRef(models_1.MessageRecipient, {
                            includeRelations: true,
                        }),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.MessageRecipient, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageRecipientController.prototype, "findById", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.UpdateMessageRecipient] }),
    rest_1.patch(`${basePath}/{id}`, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [204 /* NO_CONTENT */]: {
                description: 'MessageRecipient PATCH success',
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
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.MessageRecipient]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageRecipientController.prototype, "updateById", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.UpdateMessageRecipient] }),
    rest_1.put(`${basePath}/{id}`, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [204 /* NO_CONTENT */]: {
                description: 'MessageRecipient PUT success',
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.MessageRecipient]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageRecipientController.prototype, "replaceById", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.DeleteMessageRecipient] }),
    rest_1.del(`${basePath}/{id}`, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [204 /* NO_CONTENT */]: {
                description: 'MessageRecipient DELETE success',
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageRecipientController.prototype, "deleteById", null);
MessageRecipientController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.MessageRecipientRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MessageRecipientRepository])
], MessageRecipientController);
exports.MessageRecipientController = MessageRecipientController;
//# sourceMappingURL=message-recipient.controller.js.map