import {inject} from '@loopback/core';
import {ResponseDataType} from '../../enums';
import {DataStoreDataTypeConversionFunctions} from '../../interfaces';
import {ReportingServiceComponentBindings} from '../../keys';
import {DataTypeMapping} from './data-type-mapping';

export class S3DataTypes {
  constructor(
    @inject(
      ReportingServiceComponentBindings.GENERIC_DATA_TYPE_CONVERSION_FUNCTIONS,
    )
    private readonly conversionUtils: DataStoreDataTypeConversionFunctions,
  ) {}
  value(): Record<string, DataTypeMapping> {
    return {
      String: {
        dataType: ResponseDataType.string,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToString,
      },
      Number: {
        dataType: ResponseDataType.number,
        jsonValueType: 'number',
        convertDefaultFunc: this.conversionUtils.convertToNumber,
      },
      Boolean: {
        dataType: ResponseDataType.boolean,
        jsonValueType: 'boolean',
        convertDefaultFunc: this.conversionUtils.convertToBoolean,
      },
      Array: {
        dataType: ResponseDataType.array,
        jsonValueType: 'array',
        convertDefaultFunc: this.conversionUtils.convertToArray,
      },
      Object: {
        dataType: ResponseDataType.object,
        jsonValueType: 'object',
        convertDefaultFunc: this.conversionUtils.convertToObject,
      },
      JSON: {
        dataType: ResponseDataType.json,
        jsonValueType: 'object',
        convertDefaultFunc: this.conversionUtils.convertToObject,
      },
      Date: {
        dataType: ResponseDataType.date,
        jsonValueType: 'string',
        convertDefaultFunc: this.conversionUtils.convertToDate,
      },
    };
  }
}
