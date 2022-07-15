// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey, CoreBindings} from '@loopback/core';
import {PaymentServiceComponent} from './component';

/**
 * Binding keys used by this component.
 */
export namespace PaymentServiceComponentBindings {
  export const COMPONENT = BindingKey.create<PaymentServiceComponent>(
    `${CoreBindings.COMPONENTS}.PaymentServiceComponent`,
  );
}

export const PaymentDatasourceName = 'payment';
