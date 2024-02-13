import {DataTypeConversionOptions} from '../../enums';
import {ResponseDataType} from '../../enums/response-data-type.enum';
import {JSONValueType} from '../../interfaces';

export type DataTypeMapping = {
  dataType: ResponseDataType;
  jsonValueType: JSONValueType;

  convertDefaultFunc?: (
    value: JSONValueType,
    options?: DataTypeConversionOptions,
    // sonarignore:start
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => any;
  // sonarignore:end
};
