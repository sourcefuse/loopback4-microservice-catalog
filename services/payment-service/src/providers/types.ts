// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Orders, Subscriptions} from '../models';
import {DataObject} from '@loopback/repository';

export interface IGateway {
  create(
    payorder: Orders,
    paymentTemplate: string | undefined,
  ): Promise<unknown> | DataObject<{}>;
  charge(chargeResponse: DataObject<{}>): Promise<DataObject<{res: string}>>;
  refund(transactionId: string): Promise<unknown> | void;
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
