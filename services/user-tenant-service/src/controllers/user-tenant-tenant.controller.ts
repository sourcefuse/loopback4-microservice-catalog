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
  Tenant,
} from '../models';
import {UserTenantRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserTenantTenantController {
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
  @get('/user-tenants/{id}/tenant', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tenant belonging to UserTenant',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tenant),
          },
        },
      },
    },
  })
  async getTenant(
    @param.path.string('id') id: typeof UserTenant.prototype.id,
  ): Promise<Tenant> {
    return this.userTenantRepository.tenant(id);
  }
}
