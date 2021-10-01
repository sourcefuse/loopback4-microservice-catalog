import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {PaymentDatasourceName} from '../keys';
import {Subscriptions, SubscriptionsRelations} from '../models';

export class SubscriptionsRepository extends DefaultCrudRepository<
  Subscriptions,
  typeof Subscriptions.prototype.id,
  SubscriptionsRelations
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Subscriptions, dataSource);
  }
}
