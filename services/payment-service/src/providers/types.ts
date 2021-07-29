import {Orders} from '../models';
import {DataObject} from '@loopback/repository';

export interface IGateway {
  // eslint-disable-next-line
  create(payorder: Orders): Promise<any>;
  charge(chargeResponse: DataObject<{}>): Promise<{}>;
  // eslint-disable-next-line
  refund(transactionId: string): Promise<any>;
}
