// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {injectable, BindingScope} from '@loopback/core';

@injectable({
  scope: BindingScope.TRANSIENT,
})
export class IteratorService {
  async asyncForEach<T>(
    array: Array<T>,
    callback: (item: T, index: number) => Promise<void>,
  ) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index);
    }
  }
}
