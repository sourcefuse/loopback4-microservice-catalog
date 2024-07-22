import {BindingKey} from '@loopback/context';
import {BINDING_PREFIX} from '@sourceloop/core';
import {ClientWithSubscriptions} from './types';

export const CLIENT = BindingKey.create<ClientWithSubscriptions>(
  `${BINDING_PREFIX}.workflow.client`,
);
