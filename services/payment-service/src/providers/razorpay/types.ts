import {DataObject} from '@loopback/repository';
import {Orders} from '../../models';

export interface RazorpayPaymentGateway {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  create(payorder: Orders): Promise<any>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  charge(chargeResponse: DataObject<{razorpay_order_id: string}>): Promise<{}>;
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
