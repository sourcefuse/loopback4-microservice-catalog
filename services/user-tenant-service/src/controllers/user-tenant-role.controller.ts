import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserTenant,
  Role,
} from '../models';
import {UserTenantRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserTenantRoleController {
  constructor(
    @repository(UserTenantRepository)
    public userTenantRepository: UserTenantRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewUserTenantById],
  })
  @get('/user-tenants/{id}/role', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Role belonging to UserTenant',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Role),
          },
        },
      },
    },
  })
  async getRole(
    @param.path.string('id') id: typeof UserTenant.prototype.id,
  ): Promise<Role> {
    return this.userTenantRepository.role(id);
  }
}
