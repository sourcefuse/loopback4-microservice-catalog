import {AnyObject} from '@loopback/repository';
import {StructuredQueryInterface} from './structured-query.interface';

export interface QueryUtilityInterface {
  validateQueryObject(query: StructuredQueryInterface): boolean;
  listAllDataSourcesFromJson(
    query: StructuredQueryInterface,
    removeSchema: boolean,
  ): string[];
  jsonToQueryConverter(sqlQuery: StructuredQueryInterface): {
    query: string;
    bind: AnyObject;
  };
}
