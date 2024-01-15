import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {TaskDbSourceName} from '../../../types';
import {WebhookSubscription} from '../models';

export class WebhookSubscriptionRepository extends DefaultCrudRepository<
  WebhookSubscription,
  typeof WebhookSubscription.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(WebhookSubscription, dataSource);
  }
}
