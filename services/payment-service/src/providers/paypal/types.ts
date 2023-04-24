import {AnyObject, DataObject} from '@loopback/repository';
import {Orders, Subscriptions} from '../../models';

export interface PayPalPaymentGateway {
  create(
    payorder: Orders,
    paymentTemplate: string | undefined,
  ): Promise<string> | DataObject<{}>;
  charge(chargeResponse: {
    orderId: string;
  }): Promise<DataObject<{res: string; orderId: string}>>;
  refund(transactionId: string, note?: string): Promise<{}> | void;
  subscriptionCreate(
    subscriptions: Subscriptions,
    paymentTemplate: string | undefined,
  ): Promise<string> | {};
  subscriptionCharge(chargeResponse: AnyObject): Promise<void>;
  subscriptionWebHook(sub: DataObject<{}>): Promise<void>;
}

export interface IPayPalConfig {
  clientId?: string;
  clientSecret?: string;
}
