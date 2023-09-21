import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  TenantConfig,
  Tenant,
} from '../models';
import {TenantConfigRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class TenantConfigTenantController {
  constructor(
    @repository(TenantConfigRepository)
    public tenantConfigRepository: TenantConfigRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewTenant, PermissionKey.ViewTenantNum],
  })
  @get('/tenant-configs/{id}/tenant', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tenant belonging to TenantConfig',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tenant),
          },
        },
      },
    },
  })
  async getTenant(
    @param.path.string('id') id: typeof TenantConfig.prototype.id,
  ): Promise<Tenant> {
    return this.tenantConfigRepository.tenant(id);
  }
}
