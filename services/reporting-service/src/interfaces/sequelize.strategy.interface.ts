import {AnyObject} from '@loopback/repository';
import {DataStoreAdapter} from './data-store-adapter.interface';
import {StructuredQueryInterface} from './structured-query.interface';

export interface SequelizeStrategy extends DataStoreAdapter {
  translateQuery(
    queryObject: StructuredQueryInterface,
  ): Promise<{query: string; bind: AnyObject}>;
}
