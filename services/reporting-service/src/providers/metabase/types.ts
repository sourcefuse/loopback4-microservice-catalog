import {DataObject} from '@loopback/repository';

export interface MetabaseReports {
  getQueryData(
    queryId: string,
    userRole: string,
  ): Promise<string | DataObject<{}>>;
}
