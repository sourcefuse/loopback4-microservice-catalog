import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserGroup,
  UserTenant,
} from '../models';
import {UserGroupRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserGroupUserTenantController {
  constructor(
    @repository(UserGroupRepository)
    public userGroupRepository: UserGroupRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewUserGroupList,
      PermissionKey.ViewUserGroupListNum,
    ],
  })
  @get('/user-groups/{id}/user-tenant', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant belonging to UserGroup',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserTenant),
          },
        },
      },
    },
  })
  async getUserTenant(
    @param.path.string('id') id: typeof UserGroup.prototype.id,
  ): Promise<UserTenant> {
    return this.userGroupRepository.userTenant(id);
  }
}
