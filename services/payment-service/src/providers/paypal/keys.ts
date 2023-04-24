import {BindingKey} from '@loopback/context';
import {PayPalPaymentGateway} from './types';

export namespace PayPalBindings {
  export const PayPalConfig = BindingKey.create<{
    clientId: string;
    clientSecret: string;
  } | null>('sf.payment.config.paypal');
  export const PayPalHelper = BindingKey.create<PayPalPaymentGateway | null>(
    'sf.payment.helper.paypal',
  );
}
