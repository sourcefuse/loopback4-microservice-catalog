import {model, property} from '@loopback/repository';
import {PaymentGateways as BasePaymentGateways} from '../payment-gateways.model';

@model({
  name: 'paymentgateways',
  settings: {strict: true},
})
export class PaymentGateways extends BasePaymentGateways {
  @property({
    name: 'tenant_id',
    type: 'string',
    required: true,
  })
  tenantId: string;
}
