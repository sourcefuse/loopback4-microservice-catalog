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
  UserTenant,
} from '../models';
import {TenantRepository} from '../repositories';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';

export class TenantUserTenantController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewTenant, PermissionKey.ViewTenantNum],
  })
  @get('/tenants/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Tenant has many UserTenant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserTenant)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserTenant>,
  ): Promise<UserTenant[]> {
    return this.tenantRepository.userTenants(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateTenant, PermissionKey.CreateTenantNum],
  })
  @post('/tenants/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tenant model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserTenant)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Tenant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenant, {
            title: 'NewUserTenantInTenant',
            exclude: ['id'],
            optional: ['tenantId']
          }),
        },
      },
    }) userTenant: Omit<UserTenant, 'id'>,
  ): Promise<UserTenant> {
    return this.tenantRepository.userTenants(id).create(userTenant);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateTenant, PermissionKey.UpdateTenantNum],
  })
  @patch('/tenants/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tenant.UserTenant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenant, {partial: true}),
        },
      },
    })
    userTenant: Partial<UserTenant>,
    @param.query.object('where', getWhereSchemaFor(UserTenant)) where?: Where<UserTenant>,
  ): Promise<Count> {
    return this.tenantRepository.userTenants(id).patch(userTenant, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteTenant, PermissionKey.DeleteTenantUser],
  })
  @del('/tenants/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tenant.UserTenant DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserTenant)) where?: Where<UserTenant>,
  ): Promise<Count> {
    return this.tenantRepository.userTenants(id).delete(where);
  }
}
