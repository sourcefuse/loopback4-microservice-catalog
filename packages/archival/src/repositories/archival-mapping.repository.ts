import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';

import {ArchiveMapping} from '../models';
import {ArchivalDbSourceName} from '../types';

export class ArchivalMappingRepository extends DefaultCrudRepository<
  ArchiveMapping,
  typeof ArchiveMapping.prototype.id
> {
  constructor(
    @inject(`datasources.${ArchivalDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(ArchiveMapping, dataSource);
  }
}
