// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, intercept, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantServiceKey} from '../../keys';
import {GroupRepository, TenantRepository} from '../../repositories/sequelize';
import {UserGroupService} from '../../services/sequelize';
import {TenantGroupController as JugglerTenantGroupController} from '../tenant-group.controller';

@intercept(UserTenantServiceKey.TenantInterceptorInterceptor)
export class TenantGroupController extends JugglerTenantGroupController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected readonly currentUser: IAuthUserWithPermissions,
    @repository(GroupRepository)
    public groupRepository: GroupRepository,
    @service(UserGroupService)
    protected readonly userGroupService: UserGroupService,
  ) {
    super(tenantRepository, currentUser, groupRepository, userGroupService);
  }
}
