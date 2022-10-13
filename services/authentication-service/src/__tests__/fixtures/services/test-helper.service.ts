// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';

export class TestHelperService {
  values: AnyObject = {};

  set(key: string, value?: string) {
    this.values[key] = value;
  }

  get(key: string) {
    return this.values[key];
  }

  getAll() {
    return this.values;
  }

  reset() {
    this.values = {};
  }
}
