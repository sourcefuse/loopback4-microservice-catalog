// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {repository} from '@loopback/repository';
import {TenantRepository} from '../../repositories/sequelize';
import {TenantController as JugglerTenantController} from '../tenant.controller';

export class TenantController extends JugglerTenantController {
  constructor(
    @repository(TenantRepository)
    public tenantRepository: TenantRepository,
  ) {
    super(tenantRepository);
  }
}
