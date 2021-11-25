import { auditLog, Audit, Empty } from "./audit.proto";
import { AuditLogRepository } from "../../repositories";
/**
 * @class AuditCtrl
 * @description Implements grpc proto service
 **/
export declare class AuditCtrl implements Audit.Service {
    auditLogRepository: AuditLogRepository;
    constructor(auditLogRepository: AuditLogRepository);
    create(request: auditLog): Empty;
}
