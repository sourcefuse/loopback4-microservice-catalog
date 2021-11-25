"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditCtrl = void 0;
const tslib_1 = require("tslib");
const grpc_1 = require("@loopback/grpc");
const audit_proto_1 = require("./audit.proto");
const repositories_1 = require("../../repositories");
const repository_1 = require("@loopback/repository");
const models_1 = require("../../models");
/**
 * @class AuditCtrl
 * @description Implements grpc proto service
 **/
let AuditCtrl = class AuditCtrl {
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    // Tell LoopBack that this is a Service RPC implementation
    create(request) {
        console.log(request);
        return this.auditLogRepository.create(models_1.AuditLog);
    }
};
tslib_1.__decorate([
    grpc_1.grpc(audit_proto_1.Audit.Create),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], AuditCtrl.prototype, "create", null);
AuditCtrl = tslib_1.__decorate([
    tslib_1.__param(0, repository_1.repository(repositories_1.AuditLogRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.AuditLogRepository])
], AuditCtrl);
exports.AuditCtrl = AuditCtrl;
//# sourceMappingURL=audit.controller.js.map