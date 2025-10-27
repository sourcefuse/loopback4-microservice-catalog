import {inject} from '@loopback/core';
import {ResponseDataType} from '../../enums';
import {DataStoreDataTypeConversionFunctions} from '../../interfaces';
import {ReportingServiceComponentBindings} from '../../keys';
import {DataTypeMapping} from './data-type-mapping';
export class PostgresDataTypes {
  constructor(
    @inject(
      ReportingServiceComponentBindings.GENERIC_DATA_TYPE_CONVERSION_FUNCTIONS,
    )
    private readonly conversionUtils: DataStoreDataTypeConversionFunctions,
  ) {}
  value(): Record<string, DataTypeMapping> {
    /* eslint-disable @typescript-eslint/naming-convention */
    return {
      varchar: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      text: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },

      smallint: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      integer: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      bigint: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      numeric: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      real: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      double_precision: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      'character varying': {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      boolean: {dataType: ResponseDataType.boolean, jsonValueType: 'boolean'},

      timestamp: {
        dataType: ResponseDataType.date,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToDate,
      },
      'timestamp with time zone': {
        dataType: ResponseDataType.date,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToDate,
      },
      date: {
        dataType: ResponseDataType.date,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToDate,
      },

      json: {
        dataType: ResponseDataType.json,
        jsonValueType: 'object',
        convertDefaultFunc: this.conversionUtils.convertToObject,
      },
      jsonb: {
        dataType: ResponseDataType.json,
        jsonValueType: 'object',
        convertDefaultFunc: this.conversionUtils.convertToObject,
      },
      uuid: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },

      varchar_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },
      text_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },

      smallint_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },
      integer_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },
      bigint_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },
      numeric_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },
      real_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },
      double_precision_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },

      boolean_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },

      timestamp_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },
      timestamp_with_time_zone_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },
      date_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },

      json_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },
      jsonb_array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },
    };
  }
}
