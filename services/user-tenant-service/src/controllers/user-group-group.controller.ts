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
  Group,
} from '../models';
import {UserGroupRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserGroupGroupController {
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
  @get('/user-groups/{id}/group', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Group belonging to UserGroup',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Group),
          },
        },
      },
    },
  })
  async getGroup(
    @param.path.string('id') id: typeof UserGroup.prototype.id,
  ): Promise<Group> {
    return this.userGroupRepository.group(id);
  }
}
