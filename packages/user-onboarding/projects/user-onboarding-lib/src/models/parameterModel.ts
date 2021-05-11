import { HttpHeaders, HttpParams } from "@angular/common/http";

export interface parameterModel{
    UUID: string;
    headers?: HttpHeaders;
    // observe?: HttpObserve;
    query?: HttpParams;
    reportProgress?: boolean;
}