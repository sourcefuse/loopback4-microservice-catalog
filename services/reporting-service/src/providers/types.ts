import {DataObject} from '@loopback/repository';

export interface IReporting {
  getQueryData(
    queryId: string,
    userRole: string,
  ): Promise<string | DataObject<{}>>;
}
