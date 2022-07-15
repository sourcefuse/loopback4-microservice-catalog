// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {RazorpayPaymentGateway} from './types';

export namespace RazorpayBindings {
  export const RazorpayConfig = BindingKey.create<{
    dataKey: string;
    publishKey: string;
  } | null>('sf.payment.config.razorpay');
  export const RazorpayHelper =
    BindingKey.create<RazorpayPaymentGateway | null>(
      'sf.payment.helper.razorpay',
    );
}
