import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {NotificationDataSource} from '../datasources';
import {Pubnubnotification} from '../models';

export interface Notificationservice {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getNotification(token: string): Promise<Pubnubnotification[]>;
  createNotification(
    data: Pubnubnotification,
    token: string,
  ): Promise<Pubnubnotification>;
}

export class NotificationserviceProvider
  implements Provider<Notificationservice>
{
  constructor(
    // notification must match the name property in the datasource json file
    @inject('datasources.notification')
    protected dataSource: NotificationDataSource = new NotificationDataSource(),
  ) {}

  value(): Promise<Notificationservice> {
    return getService(this.dataSource);
  }
}
