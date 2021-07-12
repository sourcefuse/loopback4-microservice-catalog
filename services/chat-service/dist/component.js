"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatServiceComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const core_2 = require("@sourceloop/core");
const keys_1 = require("./keys");
const loopback4_authentication_1 = require("loopback4-authentication");
const loopback4_authorization_1 = require("loopback4-authorization");
const models_1 = require("./models");
const repositories_1 = require("./repositories");
const controllers_1 = require("./controllers");
let ChatServiceComponent = class ChatServiceComponent {
    constructor(application, chatConfig) {
        var _a;
        this.application = application;
        this.chatConfig = chatConfig;
        this.providers = {};
        this.bindings = [];
        this.bindings = [];
        this.providers = {};
        // Mount core component
        this.application.component(core_2.CoreComponent);
        this.application.api({
            openapi: '3.0.0',
            info: {
                title: 'Chat Service',
                version: '1.0.0',
            },
            paths: {},
            components: {
                securitySchemes: core_2.SECURITY_SCHEME_SPEC,
            },
            servers: [{ url: '/' }],
        });
        if (!((_a = this.chatConfig) === null || _a === void 0 ? void 0 : _a.useCustomSequence)) {
            // Mount default sequence if needed
            this.setupSequence();
        }
        this.repositories = [repositories_1.MessageRepository, repositories_1.MessageRecipientRepository];
        this.models = [models_1.Message, models_1.MessageRecipient];
        this.controllers = [
            controllers_1.MessageController,
            controllers_1.MessageRecipientController,
            controllers_1.MessageMessageController,
            controllers_1.MessageRecipientMessageController,
            controllers_1.MessageMessageRecipientController,
        ];
    }
    /**
     * Setup ServiceSequence by default if no other sequnce provided
     *
     */
    setupSequence() {
        this.application.sequence(core_2.ServiceSequence);
        // Mount authentication component for default sequence
        this.application.component(loopback4_authentication_1.AuthenticationComponent);
        // Mount bearer verifier component
        this.application.bind(core_2.BearerVerifierBindings.Config).to({
            authServiceUrl: '',
            type: core_2.BearerVerifierType.service,
        });
        this.application.component(core_2.BearerVerifierComponent);
        // Mount authorization component for default sequence
        this.application.bind(loopback4_authorization_1.AuthorizationBindings.CONFIG).to({
            allowAlwaysPaths: ['/explorer'],
        });
        this.application.component(loopback4_authorization_1.AuthorizationComponent);
    }
};
ChatServiceComponent = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, core_1.inject(keys_1.ChatServiceBindings.Config, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [rest_1.RestApplication, Object])
], ChatServiceComponent);
exports.ChatServiceComponent = ChatServiceComponent;
//# sourceMappingURL=component.js.map