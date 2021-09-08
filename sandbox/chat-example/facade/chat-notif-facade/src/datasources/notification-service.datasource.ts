import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {NOTIF_SVC_CONFIG} from './configs/notification.config';

@lifeCycleObserver('datasource')
export class NotificationServiceDatasource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'NotificationService';
  static readonly defaultConfig = NOTIF_SVC_CONFIG;

  constructor(
    @inject('datasources.config.NotificationService', {optional: true})
    dsConfig: object = NOTIF_SVC_CONFIG,
  ) {
    Object.assign(dsConfig, {
      options: {baseUrl: process.env.NOTIFICATION_SERVICE_URL},
    });
    super(dsConfig);
  }
}
