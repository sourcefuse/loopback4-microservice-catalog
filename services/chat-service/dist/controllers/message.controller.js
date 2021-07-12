"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const core_1 = require("@sourceloop/core");
const loopback4_authentication_1 = require("loopback4-authentication");
const loopback4_authorization_1 = require("loopback4-authorization");
const enums_1 = require("../enums");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const basePath = '/messages';
let MessageController = class MessageController {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async create(message) {
        return this.messageRepository.create(message);
    }
    async count(where) {
        return this.messageRepository.count(where);
    }
    async find(filter) {
        return this.messageRepository.find(filter);
    }
    async updateAll(message, where) {
        return this.messageRepository.updateAll(message, where);
    }
    async findById(id, filter) {
        return this.messageRepository.findById(id, filter);
    }
    async updateById(id, message) {
        await this.messageRepository.updateById(id, message);
    }
    async replaceById(id, message) {
        await this.messageRepository.replaceById(id, message);
    }
    async deleteById(id) {
        await this.messageRepository.deleteById(id);
    }
};
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
    tslib_1.__param(0, rest_1.requestBody({
        content: {
            [core_1.CONTENT_TYPE.JSON]: {
                schema: rest_1.getModelSchemaRef(models_1.Message, {
                    title: 'NewMessage',
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageController.prototype, "create", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.ViewMessage] }),
    rest_1.get(`${basePath}/count`, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Message model count',
                content: { [core_1.CONTENT_TYPE.JSON]: { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Message)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageController.prototype, "count", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.ViewMessage] }),
    rest_1.get('/messages', {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Array of Message model instances',
                content: {
                    [core_1.CONTENT_TYPE.JSON]: {
                        schema: {
                            type: 'array',
                            items: rest_1.getModelSchemaRef(models_1.Message, { includeRelations: true }),
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Message)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageController.prototype, "find", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.UpdateMessage] }),
    rest_1.patch(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Message PATCH success count',
                content: { [core_1.CONTENT_TYPE.JSON]: { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.requestBody({
        content: {
            [core_1.CONTENT_TYPE.JSON]: {
                schema: rest_1.getModelSchemaRef(models_1.Message, { partial: true }),
            },
        },
    })),
    tslib_1.__param(1, rest_1.param.where(models_1.Message)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Message, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageController.prototype, "updateAll", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.ViewMessage] }),
    rest_1.get(`${basePath}/{id}`, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Message model instance',
                content: {
                    [core_1.CONTENT_TYPE.JSON]: {
                        schema: rest_1.getModelSchemaRef(models_1.Message, { includeRelations: true }),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Message, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageController.prototype, "findById", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.UpdateMessage] }),
    rest_1.patch(`${basePath}/{id}`, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [204 /* NO_CONTENT */]: {
                description: 'Message PATCH success',
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
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Message]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageController.prototype, "updateById", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.UpdateMessage] }),
    rest_1.put(`${basePath}/{id}`, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [204 /* NO_CONTENT */]: {
                description: 'Message PUT success',
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Message]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageController.prototype, "replaceById", null);
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.DeleteMessage] }),
    rest_1.del(`${basePath}/{id}`, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [204 /* NO_CONTENT */]: {
                description: 'Message DELETE success',
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageController.prototype, "deleteById", null);
MessageController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.MessageRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MessageRepository])
], MessageController);
exports.MessageController = MessageController;
//# sourceMappingURL=message.controller.js.map