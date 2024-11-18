import {inject} from '@loopback/core';
import {ResponseDataType} from '../../enums';
import {DataStoreDataTypeConversionFunctions} from '../../interfaces';
import {ReportingServiceComponentBindings} from '../../keys';
import {DataTypeMapping} from './data-type-mapping';

export class MySqlDataTypes {
  constructor(
    @inject(
      ReportingServiceComponentBindings.GENERIC_DATA_TYPE_CONVERSION_FUNCTIONS,
    )
    private readonly conversionUtils: DataStoreDataTypeConversionFunctions,
  ) {}
  value(): Record<string, DataTypeMapping> {
    return {
      varchar: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      char: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      text: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      tinytext: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      mediumtext: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      longtext: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },

      tinyint: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      smallint: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      mediumint: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      int: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      bigint: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      float: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      double: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      decimal: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },

      date: {
        dataType: ResponseDataType.date,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToDate,
      },
      datetime: {
        dataType: ResponseDataType.date,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToDate,
      },
      timestamp: {
        dataType: ResponseDataType.date,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToDate,
      },
      time: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToDate,
      },

      bit: {
        dataType: ResponseDataType.boolean,
        jsonValueType: 'boolean',
        convertDefaultFunc: this.conversionUtils.convertToBoolean,
      },
      boolean: {
        dataType: ResponseDataType.boolean,
        jsonValueType: 'boolean',
        convertDefaultFunc: this.conversionUtils.convertToBoolean,
      },

      json: {
        dataType: ResponseDataType.json,
        jsonValueType: 'object',
        convertDefaultFunc: this.conversionUtils.convertToObject,
      },

      enum: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      set: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },

      binary: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      varbinary: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      blob: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      tinyblob: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      mediumblob: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      longblob: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
    };
  }
}
