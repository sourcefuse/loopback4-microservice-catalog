import {
  Binding,
  Component,
  ContextTags,
  ControllerClass,
  CoreBindings,
  ProviderMap,
  ServiceOrProviderClass,
  config,
  inject,
  injectable,
} from '@loopback/core';
import {Class, Repository} from '@loopback/repository';
import {Model, RestApplication} from '@loopback/rest';
import {CoreComponent} from '@sourceloop/core';
import {ArchivalComponentBindings} from './keys';
import {
  ProcessRetrievedDataProvider,
  RetrieveArchivedDataProvider,
} from './providers';
import {
  ArchivalMappingRepository,
  RetrievalJobDetailsRepository,
} from './repositories';
import {BuildWhereConditionService} from './services';
import {ImportArchivedDataService} from './services/import-archived-data.service';
import {ArchivalComponentOptions, DEFAULT_ARCHIVAL_OPTIONS} from './types';

// Configure the binding for ArchivalComponent
@injectable({tags: {[ContextTags.KEY]: ArchivalComponentBindings.COMPONENT}})
export class ArchivalComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @config()
    private options: ArchivalComponentOptions = DEFAULT_ARCHIVAL_OPTIONS,
  ) {
    this.providers = {};
    this.application.component(CoreComponent);

    this.providers[ArchivalComponentBindings.PROCESS_IMPORT_DATA.key] =
      ProcessRetrievedDataProvider;
    this.providers[ArchivalComponentBindings.GET_ARCHIVED_DATA_JOB.key] =
      RetrieveArchivedDataProvider;

    this.application
      .bind('services.BuildWhereConditionService')
      .toClass(BuildWhereConditionService);
    this.application
      .bind('services.ImportArchivedDataService')
      .toClass(ImportArchivedDataService);

    this.repositories = [
      ArchivalMappingRepository,
      RetrievalJobDetailsRepository,
    ];
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
}
