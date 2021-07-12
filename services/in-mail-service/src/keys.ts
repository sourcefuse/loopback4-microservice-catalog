import {BindingKey} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {IInMailServiceConfig} from './types';

export namespace InMailBindings {
  export const Config = BindingKey.create<IInMailServiceConfig | null>(
    `${BINDING_PREFIX}.inmail.config`,
  );
}

export const InMailDatasourceName = 'inmail';
