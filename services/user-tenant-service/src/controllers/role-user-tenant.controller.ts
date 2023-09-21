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
  Role,
  UserTenant,
} from '../models';
import {RoleRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class RoleUserTenantController {
  constructor(
    @repository(RoleRepository) protected roleRepository: RoleRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewRoles, PermissionKey.ViewRolesNum],
  })
  @get('/roles/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Role has many UserTenant',
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
    return this.roleRepository.userTenants(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.NotAllowed, PermissionKey.NotAllowedNum],
  })
  @post('/roles/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Role model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserTenant)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Role.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenant, {
            title: 'NewUserTenantInRole',
            exclude: ['id'],
            optional: ['roleId']
          }),
        },
      },
    }) userTenant: Omit<UserTenant, 'id'>,
  ): Promise<UserTenant> {
    return this.roleRepository.userTenants(id).create(userTenant);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.NotAllowed, PermissionKey.NotAllowedNum],
  })
  @patch('/roles/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Role.UserTenant PATCH success count',
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
    return this.roleRepository.userTenants(id).patch(userTenant, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.NotAllowed, PermissionKey.NotAllowedNum],
  })
  @del('/roles/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Role.UserTenant DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserTenant)) where?: Where<UserTenant>,
  ): Promise<Count> {
    return this.roleRepository.userTenants(id).delete(where);
  }
}
