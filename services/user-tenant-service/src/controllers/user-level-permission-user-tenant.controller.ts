import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserLevelPermission,
  UserTenant,
} from '../models';
import {UserLevelPermissionRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserLevelPermissionUserTenantController {
  constructor(
    @repository(UserLevelPermissionRepository)
    public userLevelPermissionRepository: UserLevelPermissionRepository,
  ) { }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewUserPermissions, PermissionKey.ViewUserPermissionsNum],
  })
  @get('/user-level-permissions/{id}/user-tenant', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant belonging to UserLevelPermission',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserTenant),
          },
        },
      },
    },
  })
  async getUserTenant(
    @param.path.string('id') id: typeof UserLevelPermission.prototype.id,
  ): Promise<UserTenant> {
    return this.userLevelPermissionRepository.userTenant(id);
  }
}
