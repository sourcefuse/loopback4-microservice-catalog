// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DataObject} from '@loopback/repository';
import {Orders, Subscriptions} from '../../models';

export interface StripePaymentGateway {
  create(
    payorder: Orders,
    paymentTemplate: string | undefined,
  ): Promise<string> | DataObject<{}>;
  charge(
    chargeResponse: DataObject<{
      stripeEmail: string;
      stripeToken: string;
      orderId: string;
    }>,
  ): Promise<DataObject<{res: string}>>;
  refund(transactionId: string): Promise<{}> | void;
  subscriptionCreate(
    subscriptions: Subscriptions,
    paymentTemplate: string | undefined,
  ): Promise<string> | {};
  subscriptionCharge(
    chargeResponse: DataObject<{
      stripeEmail: string;
      stripeToken: string;
      subscriptionId: string;
    }>,
  ): Promise<DataObject<{res: string}>>;
  subscriptionWebHook(
    sub: DataObject<{
      data: DataObject<{
        object: DataObject<{subscription: string; status: string}>;
      }>;
    }>,
  ): Promise<{}>;
}

export interface StripeOrder {
  id: string;
  totalAmount?: number;
  method?: string;
  metaData?: {};
}

export interface IStripeConfig {
  dataKey?: string;
  publishKey?: string;
}
