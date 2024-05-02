import {model, property} from '@loopback/repository';
import {Orders as BaseOrders} from '../orders.model';

@model({
  name: 'orders',
  settings: {strict: true},
})
export class Orders extends BaseOrders {
  @property({
    name: 'tenant_id',
    type: 'string',
    required: true,
  })
  tenantId: string;
}
