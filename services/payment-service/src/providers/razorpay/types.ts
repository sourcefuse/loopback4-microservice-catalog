import {DataObject} from '@loopback/repository';
import {Orders} from '../../models';

export interface RazorpayPaymentGateway {
  create(payorder: Orders): Promise<string>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  charge(chargeResponse: DataObject<{razorpay_order_id: string}>): Promise<{}>;
  refund(transactionId: string): Promise<{}>;
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
