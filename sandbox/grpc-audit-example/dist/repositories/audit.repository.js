"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const audit_log_1 = require("@sourceloop/audit-log");
const datasources_1 = require("../datasources");
let AuditLogRepository = class AuditLogRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(audit_log_1.AuditLog, dataSource);
    }
};
AuditLogRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(`datasources.${audit_log_1.AuditDbSourceName}`)),
    tslib_1.__metadata("design:paramtypes", [datasources_1.PgDataSource])
], AuditLogRepository);
exports.AuditLogRepository = AuditLogRepository;
//# sourceMappingURL=audit.repository.js.map