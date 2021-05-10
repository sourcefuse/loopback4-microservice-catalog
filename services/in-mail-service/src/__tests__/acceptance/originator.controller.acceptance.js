"use strict";
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
var testlab_1 = require("@loopback/testlab");
var jwt = require("jsonwebtoken");
var models_1 = require("../../models");
var repositories_1 = require("../../repositories");
var helper_1 = require("./helper");
describe('Originator Controller', function () {
    var app;
    var client;
    var attachmentRepo;
    var groupRepo;
    var messageRepo;
    var threadRepo;
    var pass = 'test_password';
    var testUser = {
        id: 1,
        username: 'test_user',
        password: pass,
        permissions: [
            'ComposeMail',
            'UpdateMail',
            'ReplyMail',
            'AddAttachments',
            'GetThreads',
            'GetThread',
            'GetInMails',
            'GetInMail',
            'TrashMail',
            'RestoreMail',
            'GetInMailAttachments',
            'GetMetadata',
            'DeleteAttachment'
        ]
    };
    var token = jwt.sign(testUser, 'kdskssdkdfs', {
        expiresIn: 180000,
        issuer: 'sf'
    });
    before('setupApplication', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, helper_1.setUpApplication()];
                case 1:
                    (_a = _b.sent(), app = _a.app, client = _a.client);
                    return [2 /*return*/];
            }
        });
    }); });
    after(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, app.stop()];
    }); }); });
    before(givenRepositories);
    afterEach(deleteMockData);
    it('gives status 422 when data sent is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reqData, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reqData = {};
                    return [4 /*yield*/, client
                            .post("/mails")
                            .send(reqData)
                            .expect(422)];
                case 1:
                    response = _a.sent();
                    testlab_1.expect(response).to.have.property('error');
                    return [2 /*return*/];
            }
        });
    }); });
    it('gives status 401 when no token is passed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.get("/mails").expect(401)];
                case 1:
                    response = _a.sent();
                    testlab_1.expect(response).to.have.property('error');
                    return [2 /*return*/];
            }
        });
    }); });
    it('gives status 200 when token is passed', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .get("/mails")
                        .set('authorization', "Bearer " + token)
                        .expect(200)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('gives status 422 when workingHour details are not correct', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reqToaddData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addData()];
                case 1:
                    reqToaddData = _a.sent();
                    return [4 /*yield*/, client
                            .post("/mails")
                            .set('authorization', "Bearer " + token)
                            .send(reqToaddData)
                            .expect(422)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('gives status 200 and workingHour detail when workingHour is added', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reqToaddData, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addData()];
                case 1:
                    reqToaddData = _a.sent();
                    testlab_1.expect(reqToaddData.status).to.be.equal(200);
                    return [4 /*yield*/, client
                            .get("/mails/" + reqToaddData.body.id)
                            .set('authorization', "Bearer " + token)
                            .expect(200)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('updates workingHour successfully using PATCH request', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reqToaddData, workingHourToUpdate, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addData()];
                case 1:
                    reqToaddData = _a.sent();
                    workingHourToUpdate = {
                        calendarId: 'updatedId'
                    };
                    return [4 /*yield*/, client
                            .patch("/mails/" + reqToaddData.body.id)
                            .set('authorization', "Bearer " + token)
                            .send(workingHourToUpdate)
                            .expect(204)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client
                            .get("/mails/" + reqToaddData.body.id)
                            .set('authorization', "Bearer " + token)
                            .expect(200)];
                case 3:
                    response = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('updates workingHour using PUT request', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reqToaddData, workingHourToUpdate, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addData()];
                case 1:
                    reqToaddData = _a.sent();
                    workingHourToUpdate = {
                        calendarId: 'updatedId'
                    };
                    return [4 /*yield*/, client
                            .put("/mails/" + reqToaddData.body.id)
                            .set('authorization', "Bearer " + token)
                            .send(workingHourToUpdate)
                            .expect(204)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client
                            .get("/mails/" + reqToaddData.body.id)
                            .set('authorization', "Bearer " + token)
                            .expect(200)];
                case 3:
                    response = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('deletes a workingHour successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reqToaddData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addData()];
                case 1:
                    reqToaddData = _a.sent();
                    return [4 /*yield*/, client
                            .del("/mails/" + reqToaddData.body.id)
                            .set('authorization', "Bearer " + token)
                            .expect(204)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // it('should return count', async () => {
    //   await client
    //     .get(`/mails/count`)
    //     .set('authorization', `Bearer ${token}`)
    //     .expect(200);
    // });
    function addData() {
        return __awaiter(this, void 0, void 0, function () {
            var thread, a;
            return __generator(this, function (_a) {
                thread = new models_1.Thread({
                    id: 'random-thread-id',
                    messageCounts: 4,
                    subject: 'Sample Subject',
                    groups: [
                        new models_1.Group({
                            id: 'random-group-id',
                            party: 'sample-party@example.com',
                            messageId: 'sample-message-id',
                            threadId: 'sample-thread-id'
                        }),
                    ]
                });
                a = new models_1.Message({
                    id: 'random-msg-id',
                    sender: 'tush',
                    subject: 'tush',
                    body: 'random-body',
                    status: 'random-status'
                });
                return [2 /*return*/, client
                        .post("/mails")
                        .set('authorization', "Bearer " + token)
                        .send(thread).send(a)];
            });
        });
    }
    function deleteMockData() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, attachmentRepo.deleteAllHard()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, groupRepo.deleteAllHard()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, messageRepo.deleteAllHard()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, threadRepo.deleteAllHard()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function givenRepositories() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app.getRepository(repositories_1.AttachmentRepository)];
                    case 1:
                        attachmentRepo = _a.sent();
                        return [4 /*yield*/, app.getRepository(repositories_1.GroupRepository)];
                    case 2:
                        groupRepo = _a.sent();
                        return [4 /*yield*/, app.getRepository(repositories_1.MessageRepository)];
                    case 3:
                        messageRepo = _a.sent();
                        return [4 /*yield*/, app.getRepository(repositories_1.ThreadRepository)];
                    case 4:
                        threadRepo = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
});
