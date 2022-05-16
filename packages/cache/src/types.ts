import {Options} from '@loopback/repository';

export interface CacheMixinOptions {
  prefix: string;
  salt: string;
  ttl?: number;
  scanCount?: number;
}

export interface CacheFindOptions {
  forceUpdate: boolean;
}

export declare type CacheOptions = Options & CacheFindOptions;
