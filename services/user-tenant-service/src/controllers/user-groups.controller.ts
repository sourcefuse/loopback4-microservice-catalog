// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {PermissionKey} from '../enums';
import {Count, Filter, repository, Where} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {UserGroup} from '../models';
import {UserGroupRepository} from '../repositories';

const basePath = '/user-groups';
export class UserGroupsController {
  constructor(
    @repository(UserGroupRepository)
    public userGroupRepository: UserGroupRepository,
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
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of UserGroup',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(UserGroup)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter') filter?: Filter<UserGroup>,
  ): Promise<UserGroup[]> {
    return this.userGroupRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewUserGroupList,
      PermissionKey.ViewUserGroupListNum,
    ],
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Count of UserGroup',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(UserGroup)},
          },
        },
      },
    },
  })
  async getCount(
    @param.query.object('where') where: Where<UserGroup>,
  ): Promise<Count> {
    return this.userGroupRepository.count(where);
  }
}
