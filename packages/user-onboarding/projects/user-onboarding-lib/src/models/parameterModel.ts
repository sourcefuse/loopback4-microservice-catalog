import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface ParameterModel {
  UUID: string;
  headers?: HttpHeaders;
  // observe?: HttpObserve;
  query?: HttpParams;
  reportProgress?: boolean;
}
