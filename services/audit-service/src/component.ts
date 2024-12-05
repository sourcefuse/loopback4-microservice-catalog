// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
  ServiceOrProviderClass,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  ITenantUtilitiesConfig,
  JwtKeysRepository,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
  TenantUtilitiesBindings,
  TenantUtilitiesComponent,
} from '@sourceloop/core';
import {JwtKeysRepository as SequelizeJwtKeysRepository} from '@sourceloop/core/sequelize';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {AuditController} from './controllers';
import {
  AuditServiceBindings,
  ColumnBuilderServiceBindings,
  ExportHandlerServiceBindings,
  ExportToCsvServiceBindings,
  QuerySelectedFilesServiceBindings,
} from './keys';
import {AuditLog, Job, MappingLog} from './models';
import {
  AuditLog as TenantAuditLog,
  Job as TenantJob,
  MappingLog as TenantMappingLog,
} from './models/tenant-support';
import {
  AuditLogRepository,
  JobRepository,
  MappingLogRepository,
} from './repositories';
import {
  AuditLogRepository as AuditLogSequelizeRepository,
  JobRepository as JobSequelizeRepository,
  MappingLogRepository as MappingLogSequelizeRepository,
} from './repositories/sequelize';
import {
  ColumnBuilderProvider,
  ExportHandlerProvider,
  ExportToCsvProvider,
  JobProcessingService,
  QuerySelectedFilesProvider,
} from './services';
import {IAuditServiceConfig} from './types';

export class AuditServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(AuditServiceBindings.Config, {optional: true})
    private readonly notifConfig?: IAuditServiceConfig,
    @inject(TenantUtilitiesBindings.Config, {optional: true})
    private readonly config?: ITenantUtilitiesConfig,
  ) {
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    this.application.component(TenantUtilitiesComponent);
    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Audit Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    if (!this.notifConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }

    this.services = [JobProcessingService, ColumnBuilderProvider];

    if (this.notifConfig?.useSequelize) {
      this.repositories = [
        AuditLogSequelizeRepository,
        MappingLogSequelizeRepository,
        JobSequelizeRepository,
        SequelizeJwtKeysRepository,
      ];
    } else {
      this.repositories = [
        AuditLogRepository,
        MappingLogRepository,
        JobRepository,
        JwtKeysRepository,
      ];
    }
    if (this.config?.useSingleTenant) {
      this.models = [AuditLog, MappingLog, Job];
    } else {
      this.models = [TenantAuditLog, TenantMappingLog, TenantJob];
    }

    this.controllers = [AuditController];

    this.providers[QuerySelectedFilesServiceBindings.QUERY_ARCHIVED_LOGS.key] =
      QuerySelectedFilesProvider;
    this.providers[ExportToCsvServiceBindings.EXPORT_LOGS.key] =
      ExportToCsvProvider;

    this.providers[ColumnBuilderServiceBindings.COLUMN_BUILDER.key] =
      ColumnBuilderProvider;
    this.providers[ExportHandlerServiceBindings.PROCESS_FILE.key] =
      ExportHandlerProvider;
  }

  providers?: ProviderMap = {};

  bindings?: Binding[] = [];

  services?: ServiceOrProviderClass[];

  /**
   * An optional list of Repository classes to bind for dependency injection
   * via `app.repository()` API.
   */
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   *
   */
  setupSequence() {
    this.application.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    this.application.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.application.component(BearerVerifierComponent);

    // Mount authorization component for default sequence
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}
