import {BindingKey} from '@loopback/core';
import {RazorpayPaymentGateway} from './types';

export namespace RazorpayBindings {
  export const RazorpayConfig = BindingKey.create<{
    datakey: string;
    publishKey: string;
  } | null>('sf.payment.config.razorpay');
  export const RazorpayHelper =
    BindingKey.create<RazorpayPaymentGateway | null>(
      'sf.payment.helper.razorpay',
    );
}
