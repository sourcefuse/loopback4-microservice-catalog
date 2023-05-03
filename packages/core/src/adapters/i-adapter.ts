// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// sonarignore:file
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Adapter<T, R> {
  adaptToModel(resp: R, ...rest: any[]): T;
  adaptFromModel(data: T, ...rest: any[]): R;
}
