// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {PaymentDatasourceName} from '../keys';
import {Templates} from '../models/tenant-support';

export class TemplatesRepository extends DefaultCrudRepository<
  Templates,
  typeof Templates.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject(`models.Templates`)
    private readonly templates: typeof Entity & {
      prototype: Templates;
    },
  ) {
    super(templates, dataSource);
  }
}
