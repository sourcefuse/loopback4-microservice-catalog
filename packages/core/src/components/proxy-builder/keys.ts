// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {AnyObject} from 'loopback-datasource-juggler';
import {BINDING_PREFIX} from '../../constants';
import {CrudRestServiceModifier, ModifiedRestService} from './services';
import {ProxyBuilderConfig} from './types';

export namespace ProxyBuilderBindings {
  export const CONFIG = BindingKey.create<ProxyBuilderConfig>(
    `${BINDING_PREFIX}.proxyBuilder.config`,
  );
  export const PROXY_MODIFIER = BindingKey.create<
    CrudRestServiceModifier<never>
  >(`${BINDING_PREFIX}.proxyBuilder.proxyModifier`);
  export const TOKEN_VALIDATOR = BindingKey.create<
    (context: AnyObject, token?: string) => string
  >(`${BINDING_PREFIX}.proxyBuilder.tokenValidator`);
}

export const ServiceBuilderExtensionPoint = BindingKey.create<
  ModifiedRestService<never>
>(`${BINDING_PREFIX}.proxyBuilder.serviceBuilder.extensionPoint`);
