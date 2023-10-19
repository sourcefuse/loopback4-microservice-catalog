// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  TenantRepository,
  UserTenantRepository,
} from '../../repositories/sequelize';
import {UserTenantController as JugglerUserTenantController} from '../user-tenant.controller';
export class UserTenantController extends JugglerUserTenantController {
  constructor(
    @repository(UserTenantRepository)
    protected userTenantRepository: UserTenantRepository,
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected readonly currentUser: IAuthUserWithPermissions,
  ) {
    super(userTenantRepository, tenantRepository, currentUser);
  }
}
