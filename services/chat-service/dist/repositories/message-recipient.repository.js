"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRecipientRepository = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
const core_1 = require("@loopback/core");
const core_2 = require("@sourceloop/core");
const loopback4_authentication_1 = require("loopback4-authentication");
let MessageRecipientRepository = class MessageRecipientRepository extends core_2.DefaultUserModifyCrudRepository {
    constructor(dataSource, getCurrentUser, messageRepositoryGetter) {
        super(models_1.MessageRecipient, dataSource, getCurrentUser);
        this.getCurrentUser = getCurrentUser;
        this.messageRepositoryGetter = messageRepositoryGetter;
        this.message = this.createBelongsToAccessorFor('message', messageRepositoryGetter);
        this.registerInclusionResolver('message', this.message.inclusionResolver);
    }
};
MessageRecipientRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.chatDb')),
    tslib_1.__param(1, core_1.inject.getter(loopback4_authentication_1.AuthenticationBindings.CURRENT_USER)),
    tslib_1.__param(2, repository_1.repository.getter('MessageRepository')),
    tslib_1.__metadata("design:paramtypes", [repository_1.juggler.DataSource, Function, Function])
], MessageRecipientRepository);
exports.MessageRecipientRepository = MessageRecipientRepository;
//# sourceMappingURL=message-recipient.repository.js.map