import {
  Binding,
  CoreBindings,
  LifeCycleObserver,
  MetadataInspector,
  inject,
  lifeCycleObserver,
} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {CustomTypeConvertor, IngestionHandler} from '../interfaces';
import {ReportingServiceComponentBindings} from '../keys';
import {IngestionMapping} from '../models';
import {IngestionMappingsRepository} from '../repositories';
import {DataSourcesService, ReportIngestionMessagingService} from '../services';
import {SequelizeQueryUtility} from '../utils/sequelize-query.utils';

@lifeCycleObserver()
/* The `ReportingServiceInitializer` class is responsible for initializing and configuring various
services and mappings for a reporting service. */
export class ReportingServiceInitializer implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
    @repository(IngestionMappingsRepository)
    private readonly ingestionMappingsRepo: IngestionMappingsRepository,
  ) {}

  /**
   * The "start" function binds data sources, fetches and binds ingestion mappings, processes service
   * bindings, binds mappings and services, and binds the report ingestion messaging service.
   */
  async start(): Promise<void> {
    this.bindDataSourcesService();
    const mappingsDict = await this.fetchAndBindIngestionMappings();
    const mappingsWithoutCustomListeners =
      await this.processServiceBindings(mappingsDict);
    this.bindMappingsAndServices(mappingsWithoutCustomListeners);
    this.bindReportIngestionMessagingService();
    this.application
      .bind(ReportingServiceComponentBindings.QUERY_UTILITY)
      .toClass(SequelizeQueryUtility);
  }

  /**
   * The function binds the DataSourcesService class to the DATA_SOURCES_SERVICE component in the
   * ReportingServiceComponentBindings.
   */
  private bindDataSourcesService() {
    this.application
      .bind(ReportingServiceComponentBindings.DATA_SOURCES_SERVICE)
      .toClass(DataSourcesService);
  }

  /**
   * The function fetches ingestion mappings from a repository, creates a dictionary of mappings, binds
   * the dictionary to a component, and returns the dictionary.
   * @returns a Promise that resolves to a Record<string, IngestionMapping>.
   */
  private async fetchAndBindIngestionMappings(): Promise<
    Record<string, IngestionMapping>
  > {
    const allMappings = await this.ingestionMappingsRepo.find();
    const mappingsDict = allMappings.reduce(
      (acc, mapping) => {
        acc[mapping.recordType] = mapping;
        return acc;
      },
      {} as Record<string, IngestionMapping>,
    );

    this.application
      .bind(ReportingServiceComponentBindings.INGESTION_MAPPINGS_LIST)
      .to(mappingsDict);
    return mappingsDict;
  }

  /**
   * The function processes service bindings, creates mappings, and returns a set of mappings without
   * custom listeners.
   * @param mappingsDict - A dictionary object that contains the mappings for ingestion. The keys are
   * strings representing the mapping names, and the values are objects of type IngestionMapping.
   * @returns the variable `mappingsWithoutCustomListeners`, which is a `Set<string>`.
   */
  private async processServiceBindings(
    mappingsDict: Record<string, IngestionMapping>,
  ): Promise<Set<string>> {
    const mappingsWithoutCustomListeners = new Set<string>(
      Object.keys(mappingsDict),
    );
    const serviceBindings = this.application.find('services.*');
    const serviceMapping: Record<string, IngestionHandler> = {};
    const customTypeConverters: Record<string, CustomTypeConvertor> = {};

    for (const binding of serviceBindings) {
      await this.processBinding(
        binding,
        mappingsWithoutCustomListeners,
        serviceMapping,
        customTypeConverters,
      );
    }
    this.application
      .bind(ReportingServiceComponentBindings.SERVICE_MAPPING)
      .to(serviceMapping);
    this.application
      .bind(ReportingServiceComponentBindings.CUSTOM_TYPE_CONVERTER_MAPPING)
      .to(customTypeConverters);

    return mappingsWithoutCustomListeners;
  }

  /**
   * The `processBinding` function processes a binding by checking if it is an ingestion handler or a
   * custom type converter and storing them in the appropriate mappings.
   * @param binding - A binding object that represents a dependency injection binding for an object.
   * @param mappingsWithoutCustomListeners - A set of strings representing record types that do not have
   * custom listeners associated with them.
   * @param serviceMapping - The `serviceMapping` parameter is a record (object) that maps a record type
   * to an ingestion handler. It is used to store the mapping between record types and their
   * corresponding ingestion handlers.
   * @param customTypeConverters - A record object that maps a string (convertType) to a
   * CustomTypeConvertor object.
   */
  private async processBinding(
    binding: Readonly<Binding<AnyObject>>,
    mappingsWithoutCustomListeners: Set<string>,
    serviceMapping: Record<string, IngestionHandler>,
    customTypeConverters: Record<string, CustomTypeConvertor>,
  ) {
    const serviceInstance = await this.application.get<AnyObject>(binding.key);

    /* The `if (this.isIngestionHandler(serviceInstance))` condition is checking if the `serviceInstance`
  is an instance of the `IngestionHandler` class. It uses the `isIngestionHandler` method to
  determine this. If the condition is true, it means that the `serviceInstance` is an
  `IngestionHandler`, and further processing is done to store it in the `serviceMapping` mapping. */
    if (this.isIngestionHandler(serviceInstance)) {
      const metadata = MetadataInspector.getClassMetadata(
        ReportingServiceComponentBindings.REPORT_EVENT_LISTENER_METADATA,
        serviceInstance.constructor,
      ) as {recordType?: string} | undefined;
      /* The `if` statement is checking if the `metadata` object has a `recordType` property and if the
    `mappingsWithoutCustomListeners` set contains the `recordType` as a string. */
      if (
        metadata?.recordType &&
        mappingsWithoutCustomListeners.has(metadata.recordType as string)
      ) {
        this.logger.info(
          `Found custom listener for recordType: ${metadata.recordType}`,
        );
        serviceMapping[metadata.recordType as string] = serviceInstance;
        mappingsWithoutCustomListeners.delete(metadata.recordType as string);
      }
    }

    /* The `if (this.isCustomTypeConvertor(serviceInstance))` condition is checking if the
  `serviceInstance` is an instance of a custom type converter class. It uses the
  `isCustomTypeConvertor` method to determine this. If the condition is true, it means that the
  `serviceInstance` is a custom type converter, and further processing is done to store it in the
  `customTypeConverters` mapping. */
    if (this.isCustomTypeConvertor(serviceInstance)) {
      const typeConverterMetadata = MetadataInspector.getClassMetadata(
        ReportingServiceComponentBindings.CUSTOM_TYPE_CONVERTER_METADATA,
        serviceInstance.constructor,
      ) as {convertType?: string} | undefined;;
      if (typeConverterMetadata?.convertType) {
        customTypeConverters[typeConverterMetadata.convertType as string] =
          serviceInstance;
      }
    }
  }

  /**
   * The function binds a set of mappings without custom listeners to a specific component in the
   * application.
   * @param mappingsWithoutCustomListeners - A set of strings representing mappings without custom
   * listeners.
   */
  private bindMappingsAndServices(mappingsWithoutCustomListeners: Set<string>) {
    this.application
      .bind(ReportingServiceComponentBindings.MAPPING_WITHOUT_CUSTOM_LISTENERS)
      .to(mappingsWithoutCustomListeners);
  }

  /**
   * The function binds the ReportingServiceComponentBindings.REPORTING_INGESTION_MESSAGING_SERVICE to
   * the ReportIngestionMessagingService class in the application.
   */
  private bindReportIngestionMessagingService() {
    this.application
      .bind(
        ReportingServiceComponentBindings.REPORTING_INGESTION_MESSAGING_SERVICE,
      )
      .toClass(ReportIngestionMessagingService);
  }

  /**
   * The function checks if an object is an instance of the IngestionHandler class.
   * @param {AnyObject} obj - The parameter `obj` is of type `AnyObject`, which means it can be any type
   * of object.
   * @returns a boolean value. It returns true if the given object is an instance of the IngestionHandler
   * class, and false otherwise.
   */
  private isIngestionHandler(obj: AnyObject): obj is IngestionHandler {
    const metadata = MetadataInspector.getClassMetadata(
      ReportingServiceComponentBindings.REPORT_EVENT_LISTENER_METADATA,
      obj.constructor,
    ) as {recordType?: string} | undefined;

    return !!metadata && metadata.recordType !== undefined;
  }

  /**
   * The function checks if an object is an instance of a custom type convertor class.
   * @param {AnyObject} obj - The parameter `obj` is of type `AnyObject`, which means it can be any
   * object type.
   * @returns a boolean value. It returns true if the given object is an instance of the
   * CustomTypeConvertor class and has a non-undefined convertType property. Otherwise, it returns false.
   */
  private isCustomTypeConvertor(obj: AnyObject): obj is CustomTypeConvertor {
    const metadata = MetadataInspector.getClassMetadata(
      ReportingServiceComponentBindings.CUSTOM_TYPE_CONVERTER_METADATA,
      obj.constructor,
    ) as {convertType?: string} | undefined;

    return !!metadata && metadata.convertType !== undefined;
  }
}
