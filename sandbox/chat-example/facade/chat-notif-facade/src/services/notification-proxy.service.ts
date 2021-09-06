import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {NotificationServiceDatasource} from '../datasources/notification-service.datasource';
import {NotificationServiceProxy} from '../types/notification-proxy.type';

export class NotificationServiceProxyProvider
  implements Provider<NotificationServiceProxy>
{
  constructor(
    // emailTemplateDs must match the name property in the datasource json file
    @inject('datasources.NotificationService')
    protected dataSource: NotificationServiceDatasource = new NotificationServiceDatasource(),
  ) {}

  value(): Promise<NotificationServiceProxy> {
    return getService(this.dataSource);
  }
}
