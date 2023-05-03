// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// sonarignore:file
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Adapter} from './i-adapter';

export class AnyAdapter implements Adapter<any, any> {
  adaptToModel(resp: any): any {
    return resp;
  }
  adaptFromModel(data: any): any {
    return data;
  }
}
