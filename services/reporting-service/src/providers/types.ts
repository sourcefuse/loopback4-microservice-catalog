import {DataObject} from '@loopback/repository';

export interface IReporting {
  getQueryData(
    queryId: string | undefined,
    userRole: string,
  ): Promise<string | DataObject<{}>>;
}
