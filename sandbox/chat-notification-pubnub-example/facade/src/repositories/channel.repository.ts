import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ChannelsDataSource} from '../datasources';
import {Channel} from '../models';

export class ChannelRepository extends DefaultCrudRepository<
  Channel,
  typeof Channel.prototype.id
> {
  constructor(
    @inject('datasources.channels') dataSource: ChannelsDataSource,
  ) {
    super(Channel, dataSource);
  }
}
