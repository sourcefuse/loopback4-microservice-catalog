// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {bind, BindingScope, inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserGroup} from '../models';
import {
  GroupRepository,
  UserGroupRepository,
} from '../repositories';
import {UserGroupHelperService} from './user-group-helper.service';

@bind({scope: BindingScope.REQUEST})
export class UserGroupService {
  constructor(
    @repository(GroupRepository)
    public groupRepository: GroupRepository,
    @repository(UserGroupRepository)
    public userGroupRepository: UserGroupRepository,
    @inject('services.UserGroupHelperService')
    private readonly userGroupHelperService: UserGroupHelperService,
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

}
