import {BindingKey, Constructor, CoreBindings} from '@loopback/core';
import {MetadataAccessor} from '@loopback/metadata';
import {DataSource} from '@loopback/repository';
import {Sequelize} from 'sequelize';
import {ReportingServiceComponent} from './component';
import {
  CustomTypeConvertor,
  DataSetServiceConfig,
  DataStoreAdapter,
  DataStoreConfiguration,
  DataStoreDataTypeConversionFunctions,
  IngestionHandler,
  QueryBinding,
  QueryUtilityInterface,
  SqlValidatorInterface,
} from './interfaces';
import {IngestionMapping} from './models';
import {DataTypeMapping} from './providers/data-mappings-providers/data-type-mapping';
import {DataStoreObjectInterface} from './providers/data-store-object.provider';
import {DataSourcesService, ReportIngestionMessagingService} from './services';

export namespace ReportingServiceComponentBindings {
  export const COMPONENT = BindingKey.create<ReportingServiceComponent>(
    `${CoreBindings.COMPONENTS}.ReportingServiceComponent`,
  );
  export const DATASOURCE = BindingKey.create<DataSource>(
    'datasources.ReportingCore',
  );

  export const REPORT_EVENT_LISTENER_METADATA = MetadataAccessor.create<
    Record<string, unknown>,
    ClassDecorator
  >('handleRecordType');
  export const CUSTOM_TYPE_CONVERTER_METADATA = MetadataAccessor.create<
    Record<string, unknown>,
    ClassDecorator
  >('customTypeConversion');

  export const DATA_STORE_ADAPTER =
    BindingKey.create<DataStoreAdapter>('dataStoreAdapter');
  export const INGESTION_MAPPINGS_LIST = BindingKey.create<
    Record<string, IngestionMapping>
  >('ingestionMappingsList');
  export const MAPPING_WITHOUT_CUSTOM_LISTENERS = BindingKey.create<
    Set<string>
  >('mappingWithoutCustomListeners');
  export const SERVICE_MAPPING =
    BindingKey.create<Record<string, IngestionHandler>>('serviceMappings');
  export const CUSTOM_TYPE_CONVERTER_MAPPING = BindingKey.create<
    Record<string, CustomTypeConvertor>
  >('customTypeConverterMappings');
  export const DATA_STORE_CONFIGURATION =
    BindingKey.create<DataStoreConfiguration>('config.dataStoreConfiguration');
  export const DATA_SET_CONFIG = BindingKey.create<DataSetServiceConfig>(
    'config.dataSetsService',
  );
  export const DATA_SOURCES_SERVICE = BindingKey.create<DataSourcesService>(
    'services.DataSourcesService',
  );
  export const DATA_TYPE_MAP =
    BindingKey.create<Record<string, DataTypeMapping>>('dataTypeMap');
  export const DATA_STORE_SERVICE_PROVIDER =
    BindingKey.create<DataStoreObjectInterface>(
      'services.DataStoreObjectProvider',
    );
  export const REPORTING_INGESTION_MESSAGING_SERVICE =
    BindingKey.create<ReportIngestionMessagingService>(
      'services.ReportIngestionMessagingService',
    );

  export const GENERIC_DATA_TYPE_CONVERSION_FUNCTIONS =
    BindingKey.create<DataStoreDataTypeConversionFunctions>(
      'genericataDataTypeConversionFunctions',
    );
  export const S3_OBJECT_PROVIDER = BindingKey.create<AWS.S3>(
    `datastores.S3ObjectProvider`,
  );

  export const SEQUELIZE_OBJECT_PROVIDER = BindingKey.create<Sequelize>(
    `datastores.SequelizeObjectProvider`,
  );
  export const SQL_VALIDATOR = BindingKey.create<SqlValidatorInterface>(
    `services.sqlValidator`,
  );
  export const BINDING_MANAGER_CLASS = BindingKey.create<
    Constructor<QueryBinding>
  >(`services.BindingManagerClass`);
  export const BINDING_OBJECT_PROVIDER = BindingKey.create<QueryBinding>(
    `services.QueryBindingObjectProvider`,
  );
  export const QUERY_UTILITY =
    BindingKey.create<QueryUtilityInterface>('QueryUtility');
}
