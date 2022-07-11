// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {bind, BindingScope, service} from '@loopback/core';
import {repository, Where, WhereBuilder} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {Group, UserGroup} from '../models';
import {UserGroupView} from '../models/group-user-view.model';
import {
  GroupRepository,
  UserGroupRepository,
  UserGroupViewRepository,
} from '../repositories';
import {UserGroupHelperService} from './user-group-helper.service';

@bind({scope: BindingScope.REQUEST})
export class UserGroupService {
  constructor(
    @repository(GroupRepository)
    public groupRepository: GroupRepository,
    @repository(UserGroupRepository)
    public userGroupRepository: UserGroupRepository,
    @service(UserGroupHelperService)
    private readonly userGroupHelperService: UserGroupHelperService,
    @repository(UserGroupViewRepository)
    public userGroupViewRepository: UserGroupViewRepository,
  ) {}

  async create(userGroupToCreate: Partial<UserGroup>) {
    return this.userGroupRepository.create(userGroupToCreate);
  }

  async updateById(userGroupId: string, userGroupToUpdate: Partial<UserGroup>) {
    await this.userGroupHelperService.updateById(
      userGroupId,
      userGroupToUpdate,
    );
  }

  async deleteById(userGroupId: string) {
    await this.userGroupRepository.findById(userGroupId);
    await this.userGroupRepository.deleteById(userGroupId);
  }

  async deleteAllBygroupIds(groupIds: string[]) {
    await this.userGroupRepository.deleteAll({
      groupId: {inq: groupIds},
    });
  }

  getAccessCountFilter(
    currentUser: IAuthUserWithPermissions,
    where?: Where<Group>,
  ) {
    const whereBuilder = new WhereBuilder<UserGroupView>(where);
    whereBuilder.eq('userTenantId', `${currentUser.userTenantId}`);
    return whereBuilder.build();
  }
}
