import {
    BindingKey
} from '@loopback/core';
import {
    HttpClientInitOpts,
    IRequest
} from './types';

export namespace RequestBindings {
    export const RequestProvider = BindingKey.create <IRequest > ('sf.request');
    export const FetchProvider = BindingKey.create<IRequest>('sf.notification.fetch');
    export const Config = BindingKey.create < HttpClientInitOpts | null> ('sf.request.config');
}