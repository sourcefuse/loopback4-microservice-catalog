import {CacheMixinOptions} from '../../types';

export interface RedisCacheMixinOptions extends CacheMixinOptions {
  scanCount?: number;
}
