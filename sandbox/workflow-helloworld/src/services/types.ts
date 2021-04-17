import {AnyObject} from '@loopback/repository';

export type HttpOptions = {
  query?: AnyObject;
  urlParams?: AnyObject;
  headers?: AnyObject;
};
