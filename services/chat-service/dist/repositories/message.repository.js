"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const tslib_1 = require("tslib");
const models_1 = require("../models");
const repository_1 = require("@loopback/repository");
const core_1 = require("@loopback/core");
const core_2 = require("@sourceloop/core");
const loopback4_authentication_1 = require("loopback4-authentication");
let MessageRepository = class MessageRepository extends core_2.DefaultUserModifyCrudRepository {
    constructor(dataSource, getCurrentUser, messageRecipientRepositoryGetter, messageRepositoryGetter) {
        super(models_1.Message, dataSource, getCurrentUser);
        this.getCurrentUser = getCurrentUser;
        this.messageRecipientRepositoryGetter = messageRecipientRepositoryGetter;
        this.messageRepositoryGetter = messageRepositoryGetter;
        this.messages = this.createHasManyRepositoryFactoryFor('messages', messageRepositoryGetter);
        this.registerInclusionResolver('messages', this.messages.inclusionResolver);
        this.parentMessage = this.createBelongsToAccessorFor('parentMessage', core_1.Getter.fromValue(this));
        this.registerInclusionResolver('parentMessage', this.parentMessage.inclusionResolver);
        this.messageRecipients = this.createHasManyRepositoryFactoryFor('messageRecipients', messageRecipientRepositoryGetter);
        this.registerInclusionResolver('messageRecipients', this.messageRecipients.inclusionResolver);
    }
};
MessageRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.chatDb')),
    tslib_1.__param(1, core_1.inject.getter(loopback4_authentication_1.AuthenticationBindings.CURRENT_USER)),
    tslib_1.__param(2, repository_1.repository.getter('MessageRecipientRepository')),
    tslib_1.__param(3, repository_1.repository.getter('MessageRepository')),
    tslib_1.__metadata("design:paramtypes", [repository_1.juggler.DataSource, Function, Function, Function])
], MessageRepository);
exports.MessageRepository = MessageRepository;
//# sourceMappingURL=message.repository.js.map