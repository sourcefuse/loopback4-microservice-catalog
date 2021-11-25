import { Entity } from '@loopback/repository';
import { Action } from '@sourceloop/audit-log';
export declare class AuditLog extends Entity {
    id?: string;
    action: Action;
    actedAt: Date;
    actedOn?: string;
    actionKey: string;
    entityId: string;
    actor: string;
    before?: string;
    after?: string;
    actionGroup?: string;
    [prop: string]: any;
    constructor(data?: Partial<AuditLog>);
}
