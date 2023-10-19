// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, intercept} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantServiceKey} from '../../keys';
import {UserTenantRepository} from '../../repositories/sequelize';
import {UserTenantUserLevelPermissionController as JugglerUserTenantUserLevelPermissionController} from '../user-tenant-user-level-permission.controller';

@intercept(UserTenantServiceKey.UserTenantInterceptorInterceptor)
export class UserTenantUserLevelPermissionController extends JugglerUserTenantUserLevelPermissionController {
  constructor(
    @repository(UserTenantRepository)
    protected userTenantRepository: UserTenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected readonly currentUser: IAuthUserWithPermissions,
  ) {
    super(userTenantRepository, currentUser);
  }
}
