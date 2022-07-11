// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {StripePaymentGateway} from './types';

export namespace StripeBindings {
  export const Config = BindingKey.create<{
    dataKey: string;
    publishKey: string;
  } | null>('sf.payment.config.stripe');
  export const StripeHelper = BindingKey.create<StripePaymentGateway | null>(
    'sf.payment.helper.stripe',
  );
}
