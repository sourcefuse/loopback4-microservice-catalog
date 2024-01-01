// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {PaymentDatasourceName} from '../../keys';
import {Templates} from '../../models';

export class TemplatesRepository extends SequelizeCrudRepository<
  Templates,
  typeof Templates.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: SequelizeDataSource,
  ) {
    super(Templates, dataSource);
  }
}
