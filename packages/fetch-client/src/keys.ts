import {
    BindingKey
} from '@loopback/core';
import {
    HttpClientInitOpts,
    IRequest
} from './types';

export namespace RequestBindings {
    export const FetchProvider = BindingKey.create<IRequest>('sf.request.fetch');
    export const Config = BindingKey.create < HttpClientInitOpts | null> ('sf.request.config');
}