"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.MySequence = void 0;
var context_1 = require("@loopback/context");
var rest_1 = require("@loopback/rest");
var loopback4_authentication_1 = require("loopback4-authentication");
var loopback4_authorization_1 = require("loopback4-authorization");
var SequenceActions = rest_1.RestBindings.SequenceActions;
var MySequence = /** @class */ (function () {
    function MySequence(findRoute, parseParams, invoke, send, reject, authenticateRequest, checkAuthorisation) {
        this.findRoute = findRoute;
        this.parseParams = parseParams;
        this.invoke = invoke;
        this.send = send;
        this.reject = reject;
        this.authenticateRequest = authenticateRequest;
        this.checkAuthorisation = checkAuthorisation;
    }
    MySequence.prototype.handle = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, route, args, authUser, isAccessAllowed, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        request = context.request, response = context.response;
                        route = this.findRoute(request);
                        return [4 /*yield*/, this.parseParams(request, route)];
                    case 1:
                        args = _a.sent();
                        request.body = args[args.length - 1];
                        return [4 /*yield*/, this.authenticateRequest(request, response)];
                    case 2:
                        authUser = _a.sent();
                        return [4 /*yield*/, this.checkAuthorisation(authUser === null || authUser === void 0 ? void 0 : authUser.permissions, request)];
                    case 3:
                        isAccessAllowed = _a.sent();
                        if (!isAccessAllowed) {
                            throw new rest_1.HttpErrors.Forbidden("NotAllowedAccess" /* NotAllowedAccess */);
                        }
                        return [4 /*yield*/, this.invoke(route, args)];
                    case 4:
                        result = _a.sent();
                        this.send(response, result);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        this.reject(context, err_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MySequence = __decorate([
        __param(0, context_1.inject(SequenceActions.FIND_ROUTE)),
        __param(1, context_1.inject(SequenceActions.PARSE_PARAMS)),
        __param(2, context_1.inject(SequenceActions.INVOKE_METHOD)),
        __param(3, context_1.inject(SequenceActions.SEND)),
        __param(4, context_1.inject(SequenceActions.REJECT)),
        __param(5, context_1.inject(loopback4_authentication_1.AuthenticationBindings.USER_AUTH_ACTION)),
        __param(6, context_1.inject(loopback4_authorization_1.AuthorizationBindings.AUTHORIZE_ACTION))
    ], MySequence);
    return MySequence;
}());
exports.MySequence = MySequence;
