"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySequence = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const rest_1 = require("@loopback/rest");
const loopback4_authentication_1 = require("loopback4-authentication");
const loopback4_authorization_1 = require("loopback4-authorization");
const SequenceActions = rest_1.RestBindings.SequenceActions;
let MySequence = class MySequence {
    constructor(findRoute, parseParams, invoke, send, reject, authenticateRequest, checkAuthorisation) {
        this.findRoute = findRoute;
        this.parseParams = parseParams;
        this.invoke = invoke;
        this.send = send;
        this.reject = reject;
        this.authenticateRequest = authenticateRequest;
        this.checkAuthorisation = checkAuthorisation;
    }
    async handle(context) {
        try {
            const { request, response } = context;
            const route = this.findRoute(request);
            const args = await this.parseParams(request, route);
            request.body = args[args.length - 1];
            const authUser = await this.authenticateRequest(request, response);
            const isAccessAllowed = await this.checkAuthorisation(authUser === null || authUser === void 0 ? void 0 : authUser.permissions, request);
            if (!isAccessAllowed) {
                throw new rest_1.HttpErrors.Forbidden("NotAllowedAccess" /* NotAllowedAccess */);
            }
            const result = await this.invoke(route, args);
            this.send(response, result);
        }
        catch (err) {
            this.reject(context, err);
        }
    }
};
MySequence = tslib_1.__decorate([
    tslib_1.__param(0, context_1.inject(SequenceActions.FIND_ROUTE)),
    tslib_1.__param(1, context_1.inject(SequenceActions.PARSE_PARAMS)),
    tslib_1.__param(2, context_1.inject(SequenceActions.INVOKE_METHOD)),
    tslib_1.__param(3, context_1.inject(SequenceActions.SEND)),
    tslib_1.__param(4, context_1.inject(SequenceActions.REJECT)),
    tslib_1.__param(5, context_1.inject(loopback4_authentication_1.AuthenticationBindings.USER_AUTH_ACTION)),
    tslib_1.__param(6, context_1.inject(loopback4_authorization_1.AuthorizationBindings.AUTHORIZE_ACTION)),
    tslib_1.__metadata("design:paramtypes", [Function, Function, Function, Function, Function, Function, Function])
], MySequence);
exports.MySequence = MySequence;
//# sourceMappingURL=sequence.js.map