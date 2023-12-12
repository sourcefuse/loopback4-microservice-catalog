import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {WebhookSubscriptions} from '../../../models';
import {TaskDbSourceName} from '../../../types';

export class WebhookSubscriptionsRepository extends DefaultCrudRepository<
  WebhookSubscriptions,
  typeof WebhookSubscriptions.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(WebhookSubscriptions, dataSource);
  }
}
