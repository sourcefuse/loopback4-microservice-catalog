import {AnyObject} from '@loopback/repository';
import {CustomFilter} from './custom-filter.interface';
import {StructuredQueryInterface} from './structured-query.interface';

export interface QueryUtilityInterface {
  validateQueryObject(query: StructuredQueryInterface): boolean;
  listAllDataSourcesFromJson(
    query: StructuredQueryInterface,
    removeSchema: boolean,
  ): string[];
  jsonToQueryConverter(query: StructuredQueryInterface): Promise<{
    query: string;
    bind: AnyObject;
  }>;
  prepareFinalSqlQuery(
    sqlQuery: string,
    filter: CustomFilter<AnyObject>,
  ): string;
}
