import {
  Binding,
  BindingScope,
  ContextTags,
  ControllerClass,
  CoreBindings,
  ProviderMap,
  inject,
  injectable,
} from '@loopback/core';

import {RestApplication} from '@loopback/rest';
import {
  DashboardRepository,
  DashboardWidgetRepository,
  DataSetsRepository,
  IngestionMappingsRepository,
  StateTrackingRepository,
  WidgetsRepository,
} from './repositories';
import {
  DataSetsService,
  IngestionMappingsService,
  StateTrackingService,
} from './services';

import {Class, Model, Repository} from '@loopback/repository';
import {CoreComponent, ILogger} from '@sourceloop/core';
import {
  DashboardController,
  DataSetsController,
  DataSourcesController,
  IngestionMappingsController,
  StateTrackingController,
  WidgetController,
} from './controllers';
import {ReportingServiceComponentBindings} from './keys';
import {ReportingServiceInitializer} from './observers';
import {DataStoreObjectProvider} from './providers/data-store-object.provider';
import {S3ObjectProvider} from './providers/data-store-objects/s3-object.provider';
import {SequelizeObjectProvider} from './providers/data-store-objects/sequelize-object.provider';
import {DefaultListenerService} from './services/default-listener.service';
import {GenericConversionUtils} from './utils/generic-data-type-conversion.utils';

import {QueryBindingManager} from './utils/query-binding-manager';
import {SequelizeQueryUtility} from './utils/sequelize-query.utils';

@injectable({
  tags: {[ContextTags.KEY]: ReportingServiceComponentBindings.COMPONENT},
})
export class ReportingServiceComponent {
  controllers?: ControllerClass[] = [
    DataSetsController,
    IngestionMappingsController,
    DataSourcesController,
    StateTrackingController,
    WidgetController,
    DashboardController,
  ];
  models?: Class<Model>[] = [];
  repositories: Class<Repository<Model>>[] = [
    IngestionMappingsRepository,
    StateTrackingRepository,
    DataSetsRepository,
    WidgetsRepository,
    DashboardRepository,
    DashboardWidgetRepository,
  ];
  services = [
    IngestionMappingsService,
    DataSetsService,
    DefaultListenerService,
    StateTrackingService,
  ];
  bindings?: Binding[] = [];
  providers?: ProviderMap = {};
  logger: ILogger;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.application.component(CoreComponent);
    this.application
      .bind(
        ReportingServiceComponentBindings.GENERIC_DATA_TYPE_CONVERSION_FUNCTIONS,
      )
      .toClass(GenericConversionUtils);

    this.application
      .bind(ReportingServiceComponentBindings.S3_OBJECT_PROVIDER)
      .toProvider(S3ObjectProvider);
    this.application
      .bind(ReportingServiceComponentBindings.SEQUELIZE_OBJECT_PROVIDER)
      .toProvider(SequelizeObjectProvider);

    this.application
      .bind(ReportingServiceComponentBindings.DATA_STORE_SERVICE_PROVIDER)
      .toProvider(DataStoreObjectProvider)
      .inScope(BindingScope.SINGLETON);
    this.application
      .bind(ReportingServiceComponentBindings.QUERY_UTILITY)
      .toClass(SequelizeQueryUtility);
    this.application
      .bind(ReportingServiceComponentBindings.BINDING_MANAGER)
      .toClass(QueryBindingManager)
      .inScope(BindingScope.TRANSIENT);
    this.application.lifeCycleObserver(ReportingServiceInitializer);
  }
}
