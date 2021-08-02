import {Orders} from '../models';
import {DataObject} from '@loopback/repository';

export interface IGateway {
  create(payorder: Orders): Promise<unknown>;
  charge(chargeResponse: DataObject<{}>): Promise<{}>;
  refund(transactionId: string): Promise<unknown>;
}
