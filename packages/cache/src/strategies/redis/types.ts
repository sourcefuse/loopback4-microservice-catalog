// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ICacheMixinOptions} from '../../types';

export interface IRedisCacheMixinOptions extends ICacheMixinOptions {
  scanCount?: number;
}
