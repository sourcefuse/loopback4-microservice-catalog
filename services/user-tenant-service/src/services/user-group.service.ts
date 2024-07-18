// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {bind, BindingScope, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserGroup} from '../models';
import {
  GroupRepository,
  UserGroupRepository,
  UserTenantRepository,
} from '../repositories';

type UserTenantIds = string[];

@bind({scope: BindingScope.REQUEST})
export class UserGroupService {
  constructor(
    @repository(GroupRepository)
    public groupRepository: GroupRepository,
    @repository(UserGroupRepository)
    public userGroupRepository: UserGroupRepository,
    @repository(UserTenantRepository)
    public userTenantRepository: UserTenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
  ) {}

  async create(userGroupToCreate: Partial<UserGroup>) {
    try {
      const userTenant = await this.userTenantRepository.findById(
        userGroupToCreate.userTenantId,
      ); //NOSONAR
      if (!userTenant) {
        throw new Error('user access not allowed');
      }
    } catch {
      throw new HttpErrors.Forbidden('user access not allowed');
    }

    const userGroup = await this.userGroupRepository.findOne({
      where: {
        userTenantId: userGroupToCreate.userTenantId,
        groupId: userGroupToCreate.groupId,
      },
    });
    if (userGroup) {
      throw new HttpErrors.Forbidden('User is already added in this group');
    }
    return this.userGroupRepository.create(userGroupToCreate);
  }

  async updateById(userGroupId: string, userGroupToUpdate: Partial<UserGroup>) {
    await this.userGroupRepository.findById(userGroupId);
    await this.userGroupRepository.updateById(userGroupId, userGroupToUpdate);
  }

  async createAll(
    userTenantIdArray: UserTenantIds,
    groupId: typeof UserGroup.prototype.id,
  ) {
    try {
      const userTenants = await this.userTenantRepository.find({
        where: {
          id: {inq: userTenantIdArray},
        },
      });

      if (!userTenants) {
        throw HttpErrors.Forbidden('Users access not allowed');
      }

      const userTenantIdsOfTenant = userTenants.map(
        userTenant => userTenant.id ?? '',
      );

      const userGroups = await this.userGroupRepository.find({
        where: {
          groupId: groupId,
          userTenantId: {inq: userTenantIdsOfTenant},
        },
      });
      let userTenantIdResult;
      if (userGroups) {
        const userGroupRecords = userGroups.map(
          userGroup => userGroup.userTenantId,
        );
        userTenantIdResult = userTenantIdsOfTenant.filter(
          userTenantId => !userGroupRecords.includes(userTenantId),
        );
      } else {
        userTenantIdResult = userTenantIdsOfTenant;
      }
      if (!userTenantIdResult) {
        throw new HttpErrors.Forbidden(
          'users already exist in this user group',
        );
      }

      const userGroupsToCreate = userTenantIdResult.map(userTenantId => {
        const userGroup = new UserGroup();
        userGroup.groupId = groupId;
        userGroup.userTenantId = userTenantId ?? '';
        return userGroup;
      });
      const createdUserGroups =
        await this.userGroupRepository.createAll(userGroupsToCreate);
      return createdUserGroups;
    } catch {
      throw new HttpErrors.Forbidden('User should be from same tenant');
    }
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
