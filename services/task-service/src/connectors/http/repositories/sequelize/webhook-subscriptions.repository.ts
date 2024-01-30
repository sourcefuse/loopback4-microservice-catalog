import {inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {TaskDbSourceName} from '../../../../types';
import {WebhookSubscription} from '../../models';
export class WebhookSubscriptionRepository extends SequelizeCrudRepository<
  WebhookSubscription,
  typeof WebhookSubscription.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: SequelizeDataSource,
  ) {
    super(WebhookSubscription, dataSource);
  }
}
