import {Orders} from '../models';
import {DataObject} from '@loopback/repository';

export interface IGateway {
  create(
    payorder: Orders,
    paymentTemplate: string | undefined,
  ): Promise<unknown> | DataObject<{}>;
  charge(chargeResponse: DataObject<{}>): Promise<DataObject<{res: string}>>;
  refund(transactionId: string): Promise<unknown> | void;
}
