import { Provider, ValueOrPromise } from '@loopback/core';
import { RequestInit } from "node-fetch";
import { IRequest } from '../types';
export declare class RequestProvider implements Provider<IRequest> {
    private readonly fetchProvider;
    constructor(fetchProvider: IRequest);
    value(): ValueOrPromise<IRequest>;
    sendRequest(url: string, req: RequestInit): Promise<void> | undefined;
}
