// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DataObject} from '@loopback/repository';
import {Orders, Subscriptions} from '../../models';

export interface RazorpayPaymentGateway {
  create(
    payorder: Orders,
    paymentTemplate: string | undefined,
  ): Promise<string> | DataObject<{}>;
  charge(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    chargeResponse: DataObject<{razorpay_order_id: string}>,
  ): Promise<DataObject<{res: string}>>;
  refund(transactionId: string): Promise<{}> | void;
  subscriptionCreate(
    subscriptions: Subscriptions,
    paymentTemplate: string | undefined,
  ): Promise<string> | {};
  subscriptionCharge(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    chargeResponse: DataObject<{razorpay_subscription_id: string}>,
  ): Promise<DataObject<{res: string}>>;
  subscriptionWebHook(sub: DataObject<{}>): Promise<{}>;
}
export interface RazorpayOrder {
  id: string;
  totalAmount?: number;
  status?: string;
  method?: string;
  metaData?: {};
}
export interface IRazorpayConfig {
  dataKey?: string;
  publishKey?: string;
}
