import { Provider, ValueOrPromise } from '@loopback/core';
import { RequestInit } from "node-fetch";
import { FetchHttpRequest } from "./types";
import { HttpClientInitOpts, RequestInterceptor, ResponseTransformer } from "../../types";
export declare class fetchClient implements Provider<FetchHttpRequest> {
    private readonly fetchConfig;
    readonly baseUrl: string;
    readonly baseHeaders: Record<string, string>;
    readonly baseOptions: Omit<RequestInit, "headers">;
    readonly useJson: boolean;
    protected transformResponse: ResponseTransformer;
    protected willSendRequest?: RequestInterceptor;
    constructor(fetchConfig: HttpClientInitOpts);
    value(): ValueOrPromise<FetchHttpRequest>;
    get<T>(url: string, req?: RequestInit): Promise<T>;
    post<T>(url: string, body?: any, req?: RequestInit): Promise<T>;
    put<T>(url: string, body?: any, req?: RequestInit): Promise<T>;
    patch<T>(url: string, body?: any, req?: RequestInit): Promise<T>;
    delete<T>(url: string, req?: RequestInit): Promise<T>;
    private buildRequestArgs;
}
