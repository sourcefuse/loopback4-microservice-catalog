// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, intercept} from '@loopback/core';
import {repository} from '@loopback/repository';

import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantServiceKey} from '../../keys';
import {
  TenantConfigRepository,
  TenantRepository,
} from '../../repositories/sequelize';
import {TenantTenantConfigController as JugglerTenantTenantConfigController} from '../tenant-tenant-config.controller';
@intercept(UserTenantServiceKey.TenantInterceptorInterceptor)
export class TenantTenantConfigController extends JugglerTenantTenantConfigController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
    @repository(TenantConfigRepository)
    protected tenantConfigRepository: TenantConfigRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected readonly currentUser: IAuthUserWithPermissions,
  ) {
    super(tenantRepository, tenantConfigRepository, currentUser);
  }
}
