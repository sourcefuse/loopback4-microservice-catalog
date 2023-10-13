// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject, intercept, service} from '@loopback/core';
import {Filter, Where, repository} from '@loopback/repository';
import {
  HttpErrors,
  Request,
  RestBindings,
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {
  AuthenticationBindings,
  STRATEGY,
  authenticate,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey, STATUS_CODE} from '../enums';
import {UserTenantServiceKey} from '../keys';
import {Group, UserGroup} from '../models';
import {GroupRepository, UserTenantRepository} from '../repositories';
import {UserGroupService} from '../services';

const baseUrl = '/groups/{id}/user';

@intercept(UserTenantServiceKey.GroupTenantInterceptor)
export class GroupUserController {
  constructor(
    @repository(GroupRepository) protected groupRepository: GroupRepository,
    @repository(UserTenantRepository)
    protected userTenantRepository: UserTenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
    @service(UserGroupService)
    private readonly userGroupService: UserGroupService,
    @inject.getter(RestBindings.Http.REQUEST)
    private readonly getRequest: Getter<Request>,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewUserGroupList,
      PermissionKey.ViewUserGroupListNum,
    ],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of UserGroup of a Group',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserGroup)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserGroup>,
  ): Promise<UserGroup[]> {
    return this.groupRepository.userGroups(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateUserGroup,
      PermissionKey.CreateUserGroupNum,
    ],
  })
  @post(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'UserGroup model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserGroup)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Group.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserGroup, {
            title: 'NewUserGroupInGroup',
            exclude: ['id', 'groupId'],
          }),
        },
      },
    })
    userGroup: Omit<UserGroup, 'id'>,
  ): Promise<UserGroup> {
    userGroup.groupId = id ?? '';
    return this.userGroupService.create(userGroup);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateMultipleUserGroup,
      PermissionKey.CreateMultipleUserGroupNum,
    ],
  })
  @post(`${baseUrl}/bulk`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'UserGroup model instance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserGroup)},
          },
        },
      },
    },
  })
  async createBulkUserGroups(
    @param.path.string('id') id: typeof Group.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(UserGroup, {
              title: 'NewUserGroupInGroup',
              exclude: ['id', 'groupId'],
            }),
          },
        },
      },
    })
    userGroups: UserGroup[],
  ): Promise<UserGroup[]> {
    const userTenantIdArray = userGroups.map(
      userGroup => userGroup.userTenantId,
    );
    return this.userGroupService.createAll(userTenantIdArray, id ?? '');
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.RemoveMemberFromUserGroup,
      PermissionKey.RemoveMemberFromUserGroupNum,
    ],
  })
  @del(`${baseUrl}/{userId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'DELETE Group.UserGroup',
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.path.string('userId') userId: string,
    @param.query.object('where', getWhereSchemaFor(UserGroup))
    where?: Where<UserGroup>,
  ): Promise<void> {
    const userTenant = await this.userTenantRepository.findOne({
      where: {
        userId: userId,
        tenantId: this.currentUser.tenantId,
      },
      limit: 1,
    });
    const userGroups = await this.groupRepository.userGroups(id).find({
      where: {
        groupId: id,
        userTenantId: userTenant?.id,
      },
      limit: 2,
    });
    const userGroupRecord = userGroups.find(
      userGroup => userGroup.userTenantId === userTenant?.id,
    );
    const userGroupId = userGroupRecord?.id;
    if (!userGroupRecord) {
      throw new HttpErrors.Forbidden('Unable to find user group records');
    }

    if (userGroupRecord.userTenantId === this.currentUser.userTenantId) {
      throw new HttpErrors.Forbidden(
        'An owner cannot remove himself as the owner',
      );
    }

    await this.userGroupService.deleteById(userGroupId ?? '');
    await this.groupRepository.updateById(id, {
      modifiedOn: new Date(),
    });
  }
}
