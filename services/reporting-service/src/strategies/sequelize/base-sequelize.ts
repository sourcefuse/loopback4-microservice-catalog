import {AnyObject} from '@loopback/repository';
import {ILogger} from '@sourceloop/core';
import validator from 'validator';
import {
  ColumnEntityPair,
  ColumnForDataSourceModel,
  DataSourceList,
  IngestReportRecord,
  QueryUtilityInterface,
  StructuredQueryInterface,
} from '../../interfaces';
import {JSONValueType} from '../../interfaces/json-types.interface';
import {SequelizeStrategy} from '../../interfaces/sequelize.strategy.interface';

export abstract class BaseSequelize implements SequelizeStrategy {
  logger: ILogger;
  sequilizeQuertUtility: QueryUtilityInterface;
  constructor(logger: ILogger, sequilizeQuertUtility: QueryUtilityInterface) {
    this.logger = logger;
    this.sequilizeQuertUtility = sequilizeQuertUtility;
  }

  sanitizeValue(value: JSONValueType): JSONValueType {
    if (typeof value === 'string') {
      return validator.escape(value);
    }
    return value;
  }
  abstract manageRecord(
    dataSource: string,
    data: IngestReportRecord,
    identifier?: string,
  ): Promise<AnyObject>;

  abstract listdataSources(): Promise<DataSourceList[]>;

  abstract query(
    queryObject: StructuredQueryInterface | string,
  ): Promise<AnyObject[]>;

  abstract listDataSourceColumns(
    dataSource: string,
  ): Promise<ColumnForDataSourceModel[]>;

  abstract checkIfDataSourceExists(dataSourceNames: string[]): Promise<boolean>;

  abstract checkIfColumnsExists(
    columnEntityPairs: ColumnEntityPair[],
  ): Promise<boolean>;

  abstract applyRowLevelFilter(
    initialQuery: StructuredQueryInterface,
  ): Promise<StructuredQueryInterface>;

  async translateQuery(
    queryObject: StructuredQueryInterface,
  ): Promise<{query: string; bind: AnyObject}> {
    return this.sequilizeQuertUtility.jsonToQueryConverter(queryObject);
  }
}
