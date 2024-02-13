import {AnyObject} from '@loopback/repository';
import {DataTypeConversionOptions} from '../enums';
import {JSONValueType} from './json-types.interface';

export interface DataStoreDataTypeConversionFunctions {
  convertToString(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): string;
  convertToNumber(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): number;
  convertToBoolean(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): boolean;
  convertToDate(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): string;
  convertToArray(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): AnyObject[];
  convertToObject(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): AnyObject;
}
