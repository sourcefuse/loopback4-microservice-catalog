import {DataTypeConversionOptions} from '../enums';
import {JSONSupportedTypes} from './json-types.interface';

export interface ColumnMapping {
  typeConversion?: {
    inputType?: JSONSupportedTypes;
    targetType?: string;
    customHandler?: string; // The name of a custom handler to use for this column if any
    conversionOptions?: DataTypeConversionOptions;
  };

  dataStoreKey?: string; // The key to use when storing the data in the data store

  skip?: boolean; // Optionally specify if this column should be skipped
}

export type ColumnMappings = Record<string, ColumnMapping>;
