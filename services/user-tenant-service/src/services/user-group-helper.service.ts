// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserGroup} from '../models';
import {GroupRepository, UserGroupRepository} from '../repositories';
@injectable({scope: BindingScope.TRANSIENT})
export class UserGroupHelperService {
  constructor(
    @repository(GroupRepository)
    public groupRepository: GroupRepository,
    @repository(UserGroupRepository)
    public userGroupRepository: UserGroupRepository,
  ) {}

  async updateById(userGroupId: string, userGroupToUpdate: Partial<UserGroup>) {
    await this.userGroupRepository.findById(userGroupId);
    await this.userGroupRepository.updateById(userGroupId, userGroupToUpdate);
  }
}
