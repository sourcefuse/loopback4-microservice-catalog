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
  User,
  UserTenant,
} from '../models';
import {UserRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserUserTenantController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }
  
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewUser],
  })
  @get('/users/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of User has many UserTenant',
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
    return this.userRepository.userTenants(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateUser],
  })
  @post('/users/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserTenant)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenant, {
            title: 'NewUserTenantInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userTenant: Omit<UserTenant, 'id'>,
  ): Promise<UserTenant> {
    return this.userRepository.userTenants(id).create(userTenant);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateUser],
  })
  @patch('/users/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.UserTenant PATCH success count',
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
    return this.userRepository.userTenants(id).patch(userTenant, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteUser],
  })
  @del('/users/{id}/user-tenants', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.UserTenant DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserTenant)) where?: Where<UserTenant>,
  ): Promise<Count> {
    return this.userRepository.userTenants(id).delete(where);
  }
}
