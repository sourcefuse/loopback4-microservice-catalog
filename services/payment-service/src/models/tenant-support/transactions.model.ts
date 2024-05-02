import {model, property} from '@loopback/repository';
import {Transactions as BaseTransactions} from '../transactions.model';

@model({
  name: 'transactions',
  settings: {strict: true},
})
export class Transactions extends BaseTransactions {
  @property({
    name: 'tenant_id',
    type: 'string',
    required: true,
  })
  tenantId: string;
}
