// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {HocrObject} from '../models';
import {OcrS3DbSourceName} from '../types';

export class HocrObjectRepository extends DefaultCrudRepository<
  HocrObject,
  typeof HocrObject.prototype.id
> {
  constructor(
    @inject(`datasources.${OcrS3DbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(HocrObject, dataSource);
  }
}
