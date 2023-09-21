import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Tenant,
  TenantConfig,
} from '../models';
import {TenantRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class TenantTenantConfigController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewTenant, PermissionKey.ViewTenantNum],
  })
  @get('/tenants/{id}/tenant-configs', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Tenant has many TenantConfig',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TenantConfig)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<TenantConfig>,
  ): Promise<TenantConfig[]> {
    return this.tenantRepository.tenantConfigs(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateTenant, PermissionKey.CreateTenantNum],
  })
  @post('/tenants/{id}/tenant-configs', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tenant model instance',
        content: {'application/json': {schema: getModelSchemaRef(TenantConfig)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Tenant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantConfig, {
            title: 'NewTenantConfigInTenant',
            exclude: ['id'],
            optional: ['tenantId']
          }),
        },
      },
    }) tenantConfig: Omit<TenantConfig, 'id'>,
  ): Promise<TenantConfig> {
    return this.tenantRepository.tenantConfigs(id).create(tenantConfig);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateTenant, PermissionKey.UpdateTenantNum],
  })
  @patch('/tenants/{id}/tenant-configs', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tenant.TenantConfig PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantConfig, {partial: true}),
        },
      },
    })
    tenantConfig: Partial<TenantConfig>,
    @param.query.object('where', getWhereSchemaFor(TenantConfig)) where?: Where<TenantConfig>,
  ): Promise<Count> {
    return this.tenantRepository.tenantConfigs(id).patch(tenantConfig, where);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteTenant, PermissionKey.DeleteTenantUser],
  })
  @del('/tenants/{id}/tenant-configs', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tenant.TenantConfig DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(TenantConfig)) where?: Where<TenantConfig>,
  ): Promise<Count> {
    return this.tenantRepository.tenantConfigs(id).delete(where);
  }
}
