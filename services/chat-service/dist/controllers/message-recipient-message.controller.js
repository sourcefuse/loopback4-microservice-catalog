"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRecipientMessageController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const core_1 = require("@sourceloop/core");
const loopback4_authentication_1 = require("loopback4-authentication");
const loopback4_authorization_1 = require("loopback4-authorization");
const enums_1 = require("../enums");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const basePath = '/message-recipients/{id}/message';
let MessageRecipientMessageController = class MessageRecipientMessageController {
    constructor(messageRecipientRepository) {
        this.messageRecipientRepository = messageRecipientRepository;
    }
    async getMessage(id) {
        return this.messageRecipientRepository.message(id);
    }
};
tslib_1.__decorate([
    loopback4_authentication_1.authenticate("bearer" /* BEARER */),
    loopback4_authorization_1.authorize({ permissions: [enums_1.PermissionKey.ViewMessage] }),
    rest_1.get(basePath, {
        security: core_1.OPERATION_SECURITY_SPEC,
        responses: {
            [200 /* OK */]: {
                description: 'Message belonging to MessageRecipient',
                content: {
                    [core_1.CONTENT_TYPE.JSON]: {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.Message) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessageRecipientMessageController.prototype, "getMessage", null);
MessageRecipientMessageController = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.MessageRecipientRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MessageRecipientRepository])
], MessageRecipientMessageController);
exports.MessageRecipientMessageController = MessageRecipientMessageController;
//# sourceMappingURL=message-recipient-message.controller.js.map