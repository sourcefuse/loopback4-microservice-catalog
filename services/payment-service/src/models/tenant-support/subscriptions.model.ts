import {model, property} from '@loopback/repository';
import {Subscriptions as BaseSubscriptions} from '../subscriptions.model';

@model({
  name: 'subscriptions',
  settings: {strict: true},
})
export class Subscriptions extends BaseSubscriptions {
  @property({
    name: 'tenant_id',
    type: 'string',
    required: true,
  })
  tenantId: string;
}
