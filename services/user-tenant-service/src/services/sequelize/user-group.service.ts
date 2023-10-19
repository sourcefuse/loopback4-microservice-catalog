// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserGroupService as JugglerUserGroupService} from '../user-group.service';
import { GroupRepository, UserGroupRepository, UserTenantRepository } from '../../repositories/sequelize';
export class UserGroupService extends JugglerUserGroupService {
  constructor(
    @repository(GroupRepository)
    public groupRepository: GroupRepository,
    @repository(UserGroupRepository)
    public userGroupRepository: UserGroupRepository,
    @repository(UserTenantRepository)
    public userTenantRepository: UserTenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected readonly currentUser: IAuthUserWithPermissions,
  ) {
    super(
      groupRepository,
      userGroupRepository,
      userTenantRepository,
      currentUser,
    );
  }
}
