import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {InMailDbDataSource} from '../datasources';
import {PaymentGateways, PaymentGatewaysRelations} from '../models';

export class PaymentGatewaysRepository extends DefaultCrudRepository<
  PaymentGateways,
  typeof PaymentGateways.prototype.id,
  PaymentGatewaysRelations
> {
  constructor(@inject('datasources.inmail') dataSource: InMailDbDataSource) {
    super(PaymentGateways, dataSource);
  }
}
