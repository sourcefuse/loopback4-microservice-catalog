import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {HocrObject, HocrObjectRelations} from '../models';
import {OcrS3DbSourceName} from '../types';

export class HocrObjectRepository extends DefaultCrudRepository<
  HocrObject,
  typeof HocrObject.prototype.id,
  HocrObjectRelations
> {
  constructor(
    @inject(`datasources.${OcrS3DbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(HocrObject, dataSource);
  }
}
