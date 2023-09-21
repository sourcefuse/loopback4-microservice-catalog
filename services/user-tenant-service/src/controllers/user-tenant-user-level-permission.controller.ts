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
  UserTenant,
  UserLevelPermission,
} from '../models';
import {UserTenantRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserTenantUserLevelPermissionController {
  constructor(
    @repository(UserTenantRepository) protected userTenantRepository: UserTenantRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewUserTenant,
    ],
  })
  @get('/user-tenants/{id}/user-level-permissions', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of UserTenant has many UserLevelPermission',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserLevelPermission)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserLevelPermission>,
  ): Promise<UserLevelPermission[]> {
    return this.userTenantRepository.userLevelPermissions(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateUserTenant,PermissionKey.CreateUserPermissions
    ],
  })
  @post('/user-tenants/{id}/user-level-permissions', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserLevelPermission)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof UserTenant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserLevelPermission, {
            title: 'NewUserLevelPermissionInUserTenant',
            exclude: ['id'],
            optional: ['userTenantId']
          }),
        },
      },
    }) userLevelPermission: Omit<UserLevelPermission, 'id'>,
  ): Promise<UserLevelPermission> {
    return this.userTenantRepository.userLevelPermissions(id).create(userLevelPermission);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserTenant,PermissionKey.UpdateUserPermissions
    ],
  })
  @patch('/user-tenants/{id}/user-level-permissions', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant.UserLevelPermission PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserLevelPermission, {partial: true}),
        },
      },
    })
    userLevelPermission: Partial<UserLevelPermission>,
    @param.query.object('where', getWhereSchemaFor(UserLevelPermission)) where?: Where<UserLevelPermission>,
  ): Promise<Count> {
    return this.userTenantRepository.userLevelPermissions(id).patch(userLevelPermission, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteUserTenant
    ],
  })
  @del('/user-tenants/{id}/user-level-permissions', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant.UserLevelPermission DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserLevelPermission)) where?: Where<UserLevelPermission>,
  ): Promise<Count> {
    return this.userTenantRepository.userLevelPermissions(id).delete(where);
  }
}
