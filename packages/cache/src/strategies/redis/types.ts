import {ICacheMixinOptions} from '../../types';

export interface IRedisCacheMixinOptions extends ICacheMixinOptions {
  scanCount?: number;
}
