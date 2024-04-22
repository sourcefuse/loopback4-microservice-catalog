import {BindingKey} from '@loopback/context';
import {IPayPalConfig, PayPalPaymentGateway} from './types';

export namespace PayPalBindings {
  export const PayPalConfig = BindingKey.create<IPayPalConfig | null>(
    'sf.payment.config.paypal',
  );
  export const PayPalHelper = BindingKey.create<PayPalPaymentGateway | null>(
    'sf.payment.helper.paypal',
  );
}
