import {DataObject} from '@loopback/repository';
import {Orders} from '../../models';

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
