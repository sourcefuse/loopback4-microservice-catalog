import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {InMailDbDataSource} from '../datasources';
import {PaymentGateways} from '../models';

export class PaymentGatewaysRepository extends DefaultCrudRepository<
  PaymentGateways,
  typeof PaymentGateways.prototype.id
> {
  constructor(@inject('datasources.inmail') dataSource: InMailDbDataSource) {
    super(PaymentGateways, dataSource);
  }
}
