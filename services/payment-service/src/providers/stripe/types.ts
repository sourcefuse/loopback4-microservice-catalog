import {DataObject} from '@loopback/repository';
import {Orders} from '../../models';

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
  refund(transactionId: string): Promise<{} | void>;
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
