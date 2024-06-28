import {AnyObject} from '@loopback/repository';
import {ColumnForDataSourceModel} from '../models/column-from-data-source.model';

import {ColumnEntityPair} from './column-entity-pair.interface';
import {DataSourceList} from './data-sources.interface';
import {IngestReportRecord} from './ingest-report-record.interface';
import {StructuredQueryInterface} from './structured-query.interface';

export interface DataStoreAdapter {
  listdataSources(): Promise<DataSourceList[]>;
  query(queryObject: StructuredQueryInterface | string): Promise<AnyObject[]>;
  manageRecord(
    dataSource: string,
    data: IngestReportRecord,
    identifier: string,
  ): Promise<AnyObject>;
  listDataSourceColumns(
    dataSource: string,
  ): Promise<ColumnForDataSourceModel[]>;
  checkIfDataSourceExists(dataSourceNames: string[]): Promise<boolean>;
  checkIfColumnsExists(columnEntityPairs: ColumnEntityPair[]): Promise<boolean>;
  applyRowLevelFilter(
    initialQuery: StructuredQueryInterface,
  ): Promise<StructuredQueryInterface>;
}
