import {AnyObject} from '@loopback/repository';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CustomFilter<T extends AnyObject> {
  order?: string[];
  limit?: number;
  offset?: number;
}
