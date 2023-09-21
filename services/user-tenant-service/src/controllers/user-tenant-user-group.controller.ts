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
  UserGroup,
} from '../models';
import {UserTenantRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserTenantUserGroupController {
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
  @get('/user-tenants/{id}/user-groups', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of UserTenant has many UserGroup',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserGroup)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserGroup>,
  ): Promise<UserGroup[]> {
    return this.userTenantRepository.userGroups(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateUserTenant,PermissionKey.CreateUserGroup
    ],
  })
  @post('/user-tenants/{id}/user-groups', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserGroup)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof UserTenant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserGroup, {
            title: 'NewUserGroupInUserTenant',
            exclude: ['id'],
            optional: ['userTenantId']
          }),
        },
      },
    }) userGroup: Omit<UserGroup, 'id'>,
  ): Promise<UserGroup> {
    return this.userTenantRepository.userGroups(id).create(userGroup);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserTenant,PermissionKey.UpdateUserGroup
    ],
  })
  @patch('/user-tenants/{id}/user-groups', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant.UserGroup PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserGroup, {partial: true}),
        },
      },
    })
    userGroup: Partial<UserGroup>,
    @param.query.object('where', getWhereSchemaFor(UserGroup)) where?: Where<UserGroup>,
  ): Promise<Count> {
    return this.userTenantRepository.userGroups(id).patch(userGroup, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteUserTenant
    ],
  })
  @del('/user-tenants/{id}/user-groups', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant.UserGroup DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserGroup)) where?: Where<UserGroup>,
  ): Promise<Count> {
    return this.userTenantRepository.userGroups(id).delete(where);
  }
}
