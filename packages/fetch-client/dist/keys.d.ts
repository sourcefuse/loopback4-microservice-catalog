import { BindingKey } from '@loopback/core';
import { HttpClientInitOpts, IRequest } from './types';
export declare namespace RequestBindings {
    const FetchProvider: BindingKey<IRequest>;
    const Config: BindingKey<HttpClientInitOpts | null>;
}
