import {DataObject} from '@loopback/repository';
import {Orders} from '../../models';

export interface StripePaymentGateway {
  create(payorder: Orders): Promise<string>;
  charge(
    chargeResponse: DataObject<{stripeEmail: string; stripeToken: string}>,
  ): Promise<{}>;
  refund(transactionId: string): Promise<{}>;
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
