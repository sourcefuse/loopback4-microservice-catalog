"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const audit_log_1 = require("@sourceloop/audit-log");
let AuditLog = class AuditLog extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        id: true,
        generated: false,
    }),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
tslib_1.__decorate([
    repository_1.property({
        name: 'acted_at',
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], AuditLog.prototype, "actedAt", void 0);
tslib_1.__decorate([
    repository_1.property({
        name: 'acted_on',
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "actedOn", void 0);
tslib_1.__decorate([
    repository_1.property({
        name: 'action_key',
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "actionKey", void 0);
tslib_1.__decorate([
    repository_1.property({
        name: 'entity_id',
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "entityId", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "actor", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "before", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "after", void 0);
tslib_1.__decorate([
    repository_1.property({
        name: 'action_group',
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "actionGroup", void 0);
AuditLog = tslib_1.__decorate([
    repository_1.model({
        name: 'audit_logs',
        settings: {
            strict: false,
        },
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], AuditLog);
exports.AuditLog = AuditLog;
//# sourceMappingURL=audit-log.model.js.map