import {AnyObject} from '@loopback/repository';

export type JSONSupportedTypes =
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'array'
  | 'object';
export type JSONValueType =
  | string
  | number
  | boolean
  | null
  | AnyObject[]
  | Record<string, AnyObject>;
