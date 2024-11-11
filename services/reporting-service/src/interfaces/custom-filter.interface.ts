import {AnyObject} from '@loopback/repository';
import {WhereClause} from './structured-query.interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CustomFilter<T extends AnyObject> {
  where?: WhereClause;
  order?: string[];
  limit?: number;
  offset?: number;
}
