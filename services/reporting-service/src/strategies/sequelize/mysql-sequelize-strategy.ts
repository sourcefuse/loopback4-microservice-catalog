import {AnyObject} from '@loopback/repository';
import {ILogger} from '@sourceloop/core';
import {Sequelize} from 'sequelize';
import {
  ColumnEntityPair,
  ColumnForDataSourceModel,
  DataSourceList,
  IngestReportRecord,
  QueryUtilityInterface,
  StructuredQueryInterface,
} from '../../interfaces';
import {BaseSequelize} from '../sequelize/base-sequelize';
const METHOD_NOT_IMPLEMENTED = 'Method not implemented.';
export class MysqlSequelizeStrategy extends BaseSequelize {
  sequelize: Sequelize;
  constructor(
    sequelizeObj: Sequelize,
    logger: ILogger,
    queryUtility: QueryUtilityInterface,
  ) {
    super(logger, queryUtility);
    this.sequelize = sequelizeObj;
  }
  async listdataSources(): Promise<DataSourceList[]> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  query(queryObject: StructuredQueryInterface | string): Promise<AnyObject[]> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  listDataSourceColumns(
    dataSource: string,
  ): Promise<ColumnForDataSourceModel[]> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }

  checkIfDataSourceExists(dataSourceNames: string[]): Promise<boolean> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  checkIfColumnsExists(
    columnEntityPairs: ColumnEntityPair[],
  ): Promise<boolean> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  applyRowLevelFilter(
    initialQuery: StructuredQueryInterface,
  ): Promise<StructuredQueryInterface> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  async manageRecord(
    dataSource: string,
    data: IngestReportRecord,
    identifier = 'id',
  ): Promise<AnyObject> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }

  translateQuery(
    queryObject: StructuredQueryInterface,
  ): Promise<{query: string; bind: AnyObject}> {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
}
