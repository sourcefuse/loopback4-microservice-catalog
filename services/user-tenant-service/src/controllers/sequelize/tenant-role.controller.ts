// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, intercept} from '@loopback/core';
import {repository} from '@loopback/repository';

import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

import {UserTenantServiceKey} from '../../keys';
import {RoleRepository, TenantRepository} from '../../repositories/sequelize';
import {TenantRoleController as JugglerTenantRoleController} from '../tenant-role.controller';

@intercept(UserTenantServiceKey.TenantInterceptorInterceptor)
export class TenantRoleController extends JugglerTenantRoleController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
    @repository(RoleRepository) protected roleRepository: RoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected currentUser: IAuthUserWithPermissions,
  ) {
    super(tenantRepository, roleRepository, currentUser);
  }
}
