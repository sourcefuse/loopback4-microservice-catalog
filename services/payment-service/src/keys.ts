// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey, CoreBindings} from '@loopback/core';
import {BINDING_PREFIX} from '@sourceloop/core';
import {PaymentServiceComponent} from './component';
import {PaymentServiceConfig} from './types';

/**
 * Binding keys used by this component.
 */
export namespace PaymentServiceComponentBindings {
  export const COMPONENT = BindingKey.create<PaymentServiceComponent>(
    `${CoreBindings.COMPONENTS}.PaymentServiceComponent`,
  );
}
export namespace PaymentServiceBindings {
  export const Config = BindingKey.create<PaymentServiceConfig>(
    `${BINDING_PREFIX}.payment.config`,
  );
}
export const PaymentDatasourceName = 'payment';
