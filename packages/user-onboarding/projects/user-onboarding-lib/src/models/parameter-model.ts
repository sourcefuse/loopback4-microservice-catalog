// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface ParameterModel {
  UUID: string;
  headers?: HttpHeaders;
  // observe?: HttpObserve;
  query?: HttpParams;
  reportProgress?: boolean;
}
