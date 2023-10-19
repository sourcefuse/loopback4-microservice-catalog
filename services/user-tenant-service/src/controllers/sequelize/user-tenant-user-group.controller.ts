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
import {UserTenantUserGroupController as JugglerUserTenantUserGroupController} from '../user-tenant-user-group.controller';
@intercept(UserTenantServiceKey.UserTenantInterceptorInterceptor)
export class UserTenantUserGroupController extends JugglerUserTenantUserGroupController {
  constructor(
    @repository(UserTenantRepository)
    protected userTenantRepository: UserTenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected readonly currentUser: IAuthUserWithPermissions,
  ) {
    super(userTenantRepository, currentUser);
  }
}
