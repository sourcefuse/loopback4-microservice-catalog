import {BindingScope, inject, injectable} from '@loopback/core';
import {
  CustomTypeConvertor,
  DataStoreAdapter,
  IngestReportRecord,
  IngestionHandler,
} from '../interfaces';
import {ReportingServiceComponentBindings} from '../keys';
import {IngestionMapping, StateTracking} from '../models';
import {StateTrackingRepository} from '../repositories';
import {validateIngestReportRecord} from '../utils/validate-ingest-report-record';

import {ILogger, LOGGER} from '@sourceloop/core';
import {DataTypeConversionOptions} from '../enums';
import {ColumnMappings} from '../interfaces/column-mappings.interface';
import {JSONValueType} from '../interfaces/json-types.interface';
import {DataTypeMapping} from '../providers/data-mappings-providers/data-type-mapping';
import {DefaultListenerService} from './default-listener.service';

@injectable({scope: BindingScope.SINGLETON})

/* The `ReportIngestionMessagingService` class is responsible for tracking the state of records,
processing incoming payloads, applying column transformations, and validating and logging payloads. */
export class ReportIngestionMessagingService {
  constructor(
    @inject('repositories.StateTrackingRepository')
    private stateTrackingRepo: StateTrackingRepository,
    @inject('services.DefaultListenerService')
    private defaultListenerService: DefaultListenerService,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject(ReportingServiceComponentBindings.DATA_STORE_ADAPTER)
    private dataStoreAdapter: DataStoreAdapter,
    @inject(ReportingServiceComponentBindings.INGESTION_MAPPINGS_LIST)
    private validIngestionMappings: Record<string, IngestionMapping>,
    @inject(ReportingServiceComponentBindings.MAPPING_WITHOUT_CUSTOM_LISTENERS)
    private mappingsWithoutCustomListeners: Set<string>,
    @inject(ReportingServiceComponentBindings.SERVICE_MAPPING)
    private serviceMapping: Record<string, IngestionHandler>,
    @inject(ReportingServiceComponentBindings.CUSTOM_TYPE_CONVERTER_MAPPING)
    private customTypeConverters: Record<string, CustomTypeConvertor>,
    @inject(ReportingServiceComponentBindings.DATA_TYPE_MAP, {optional: true})
    private dataTypeMap?: Record<string, DataTypeMapping>,
  ) {}

  /**
   * The function `trackState` is an asynchronous function that tracks the state of a record by
   * creating or updating a StateTracking object in a repository based on the provided payload and
   * error.
   * @param {string} state - The `state` parameter is a string that represents the current state of the
   * tracking. It could be any value that is meaningful in the context of your application's tracking
   * system.
   * @param {IngestReportRecord} payload - The `payload` parameter is an object of type
   * `IngestReportRecord`. It contains information about a record that is being tracked. The properties
   * of this object include:
   * @param {Error} [error] - The `error` parameter is an optional parameter of type `Error`. It is
   * used to pass an error object to the `trackState` function. If an error object is provided, it will
   * be used to populate the `errorDetails` object, which contains information about the error such as
   * its message
   */
  async trackState(state: string, payload: IngestReportRecord, error?: Error) {
    const whereObj = {
      where: {
        recordId: payload.recordId,
        recordType: payload.recordType,
        timestamp: payload.timestamp,
      },
    };
    const existingTracking = await this.stateTrackingRepo.findOne(whereObj);

    const errorDetails = error
      ? {
          message: error.message,
          name: error.name,
          stack: error.stack,
        }
      : undefined;
    const tracking = new StateTracking({
      recordId: payload.recordId,
      state,
      payload: JSON.stringify(payload),
      recordType: payload.recordType,
      timestamp: payload.timestamp,
      error: errorDetails ? JSON.stringify(errorDetails) : undefined,
    } as StateTracking);

    if (existingTracking) {
      await this.stateTrackingRepo.updateById(existingTracking.id, tracking);
    } else {
      await this.stateTrackingRepo.create(tracking);
    }
  }

  /**
   * The function processes a message payload by validating it, determining the service to invoke,
   * applying transformations, tracking the state, and processing the message using the appropriate
   * service.
   * @param {IngestReportRecord} payload - The `payload` parameter is of type `IngestReportRecord`.
   * @returns The function `processMessage` returns nothing (i.e., `undefined`).
   */
  async processMessage(payload: IngestReportRecord) {
    if (!this.validateAndLogPayload(payload)) return;

    const serviceToInvoke = this.determineServiceToInvoke(payload);
    if (!serviceToInvoke) {
      this.logger.error(
        `No listener found for recordType: ${payload.recordType}, recordId: ${payload.recordId}`,
      );
      return;
    }
    const payloadT = await this.applyTransformation(payload);
    try {
      await this.trackState('Received', payloadT);
      await serviceToInvoke.processMessage(
        this.dataStoreAdapter,
        payloadT,
        this.validIngestionMappings[payloadT.recordType],
      );

      await this.trackState('Processed', payloadT);
    } catch (error) {
      await this.trackState('Failed', payloadT, error);
      this.logger.error(
        `Failed to process message for recordType: ${
          payloadT.recordType
        } error ${JSON.stringify(error.message)}`,
      );
    }
  }

  /**
   * The `applyTransformation` function applies column transformations to a payload object if defined,
   * and returns the transformed payload.
   * @param {IngestReportRecord} payload - The `payload` parameter is an object of type
   * `IngestReportRecord`.
   * @returns a Promise that resolves to an IngestReportRecord.
   */
  private async applyTransformation(
    payload: IngestReportRecord,
  ): Promise<IngestReportRecord> {
    if (!payload.cdc) return payload;
    const ingestionMapping = this.validIngestionMappings[payload.recordType];
    const columnTransformations: ColumnMappings =
      ingestionMapping?.columnTransformations || {};
    // If there are no column transformations defined, return the payload as is
    if (Object.keys(columnTransformations).length === 0) {
      return payload;
    }
    // Apply column transformations to the CDC payload

    const newCurrentValues: Record<string, JSONValueType> = {};
    const transformationPromises: Promise<{
      key: string;
      value: JSONValueType;
    }>[] = [];

    for (const [key, value] of Object.entries(payload.cdc.currentValue)) {
      const transformation = columnTransformations[key];
      if (transformation && !transformation.skip) {
        const promise = this.transformColumn(key, value, transformation).then(
          transformedValue => {
            return {
              key: transformation.dataStoreKey ?? key,
              value: transformedValue,
            };
          },
        );
        transformationPromises.push(promise);
      } else {
        newCurrentValues[key] = value;
      }
    }

    const transformedResults = await Promise.all(transformationPromises);
    for (const {key, value} of transformedResults) {
      newCurrentValues[key] = value;
    }

    payload.cdc.currentValue = newCurrentValues;
    return payload;
  }
  /**
   * The function `transformColumn` applies a column transformation to a given key-value pair,
   * returning the transformed value or the original value if no transformation is specified.
   * @param {string} key - A string representing the key or name of the column in a data table or
   * object.
   * @param {JSONValueType} value - The `value` parameter is the original value of the column that
   * needs to be transformed. It can be of any JSON value type, such as string, number, boolean, array,
   * or object.
   * @param [transformation] - The `transformation` parameter is an optional argument that represents
   * the specific transformation to be applied to the column. It is of type `ColumnMappings[keyof
   * ColumnMappings]`, which means it can take any value from the `ColumnMappings` object. The
   * `ColumnMappings` object is a mapping of
   * @returns a Promise that resolves to a value of type JSONValueType.
   */
  async transformColumn(
    key: string,
    value: JSONValueType,
    transformation?: ColumnMappings[keyof ColumnMappings],
  ): Promise<JSONValueType> {
    if (!transformation) {
      this.logger.info(`No column transformation found for ${key}`);
      return value; // Return original value if no transformation is needed
    }

    this.logger.info(`Applying column transformation for ${key}`);
    return this.applyColumnTypeConversion(key, value, transformation);
  }
  /**
   * The function `applyColumnTypeConversion` applies type conversion to a given value based on a
   * specified transformation, using custom type converters if available, and falls back to default SQL
   * type conversion if necessary.
   * @param {string} key - A string representing the key of the column in the data object.
   * @param {JSONSupportedTypes} value - The `value` parameter is of type `JSONSupportedTypes`, which
   * means it can accept any JSON-supported data type.
   * @param transformation - The `transformation` parameter is an object that contains information about
   * the column mapping for a specific key. It includes the following properties:
   * @returns a Promise that resolves to an object of type AnyObject.
   */
  private async applyColumnTypeConversion(
    key: string,
    value: JSONValueType,
    transformation: ColumnMappings[keyof ColumnMappings],
  ): Promise<JSONValueType> {
    if (transformation.typeConversion?.customHandler) {
      this.logger.info(`Applying custom type conversion for ${key}`);
      const customConverter =
        this.customTypeConverters[transformation.typeConversion.customHandler];

      if (customConverter) {
        this.logger.info(`Found custom type conversion handler for ${key}`);
        return customConverter.customTypeConverter(
          value,
          transformation.typeConversion.inputType,
          transformation.typeConversion.targetType,
        );
      }
    }

    if (
      transformation.typeConversion?.targetType &&
      transformation.typeConversion?.inputType &&
      !transformation.typeConversion?.customHandler
    ) {
      this.logger.info(
        `Applying default type conversion for ${key}, for this key no custom handler is found but type conversion is defined in mapping`,
      );

      return this.convertDataType(
        value,
        transformation.typeConversion.targetType,
        transformation.typeConversion.conversionOptions,
      );
    }

    return value;
  }
  /**
   * The function `convertDataType` converts a value to a specified data type using a mapping provided
   * in `dataTypeMap`.
   * @param {JSONValueType} value - The `value` parameter is the value that needs to be converted to a
   * different data type.
   * @param {string} dataType - The `dataType` parameter is a string that represents the desired data
   * type to convert the `value` to. It is used to look up the appropriate conversion function in the
   * `dataTypeMap` object.
   * @param {DataTypeConversionOptions} [options] - The `options` parameter is an optional object that
   * contains additional configuration options for the data type conversion. It is of type
   * `DataTypeConversionOptions`.
   * @returns the value directly if mappings are not provided. If mappings are provided and there is a
   * convertDefaultFunc defined for the specified dataType, then the function will return the result of
   * calling the convertDefaultFunc with the value and options as arguments. Otherwise, it will return
   * the value directly.
   */
  private convertDataType(
    value: JSONValueType,
    dataType: string,
    options?: DataTypeConversionOptions,
    // sonarignore:start
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    // sonarignore:end
    // Return the value directly if mappings are not provided
    if (!this.dataTypeMap) {
      return value;
    }

    const typeMapping = this.dataTypeMap[dataType];

    if (typeMapping?.convertDefaultFunc) {
      return typeMapping.convertDefaultFunc(value, options);
    } else {
      return value;
    }
  }
  /**
   * The function determines which service to invoke based on the payload's record type, and returns
   * the appropriate service or a default listener service if no custom listener is found.
   * @param {IngestReportRecord} payload - The `payload` parameter is of type `IngestReportRecord`. It
   * represents the data that needs to be processed or ingested.
   * @returns the variable "serviceToInvoke" if it is truthy, otherwise it returns the
   * "defaultListenerService".
   */
  private determineServiceToInvoke(
    payload: IngestReportRecord,
  ): IngestionHandler {
    const serviceToInvoke = this.serviceMapping[payload.recordType];

    if (
      !serviceToInvoke &&
      this.mappingsWithoutCustomListeners.has(payload.recordType)
    ) {
      this.logger.info(
        `No custom listener found for event: ${payload.recordType}`,
      );
      return this.defaultListenerService;
    } else {
      return serviceToInvoke;
    }
  }

  /**
   * The function validates and logs an IngestReportRecord payload, returning true if the validation is
   * successful and false otherwise.
   * @param {IngestReportRecord} payload - The parameter `payload` is of type `IngestReportRecord`.
   * @returns a boolean value. It returns true if the payload passes the validation and false if the
   * payload fails the validation.
   */
  private validateAndLogPayload(payload: IngestReportRecord) {
    try {
      validateIngestReportRecord(payload);
      this.logger.info('Valid Ingestion Record payload received');
      return true;
    } catch (error) {
      this.logger.error(
        `Payload validation failed: ${JSON.stringify(error.message)}`,
      );
      return false;
    }
  }
}
