import {JSONSupportedTypes, JSONValueType} from './json-types.interface';

export interface CustomTypeConvertor {
  customTypeConverter(
    value: JSONValueType,
    inputType?: JSONSupportedTypes,
    targetType?: string, //this should match the key of mappings, ex: varchar refer mapping/data-types/postgres-data-types.ts
    // sonarignore:start
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any>;
  // sonarignore:end
}
