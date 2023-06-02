import {CoreBindings, inject} from '@loopback/core';
import {AuditServiceComponent as AuditServiceJugglerComponent} from './component';
import {RestApplication} from '@loopback/rest';
import {AuditServiceBindings} from './keys';
import {IAuditServiceConfig} from './types';
import {AuditLogRepository} from './sequelize.index';
import {AuditController} from './controllers/sequelize';

export class AuditServiceComponent extends AuditServiceJugglerComponent {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    restApp: RestApplication,
    @inject(AuditServiceBindings.Config, {optional: true})
    auditConfig?: IAuditServiceConfig,
  ) {
    super(restApp, auditConfig);

    this.repositories = [AuditLogRepository];
    this.controllers = [AuditController];
  }
}
