// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {HocrResults} from '../models';
import {OcrDbSourceName} from '../types';

export class HocrResultRepository extends DefaultSoftCrudRepository<
  HocrResults,
  typeof HocrResults.prototype.id
> {
  constructor(
    @inject(`datasources.${OcrDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(HocrResults, dataSource);
  }
}
