import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {ChannelsDataSource} from '../datasources';
import {Channel, ChannelRelations} from '../models';

export class ChannelRepository extends DefaultCrudRepository<
  Channel,
  typeof Channel.prototype.id,
  ChannelRelations
> {
  constructor(
    @inject('datasources.channels') dataSource: ChannelsDataSource,
  ) {
    super(Channel, dataSource);
  }
}
