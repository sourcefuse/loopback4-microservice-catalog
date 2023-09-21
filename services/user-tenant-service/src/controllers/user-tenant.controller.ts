import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserTenant} from '../models';
import {UserTenantRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserTenantController {
  constructor(
    @repository(UserTenantRepository)
    public userTenantRepository : UserTenantRepository,
  ) {}
  
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateUserTenant,
    ],
  })
  @post('/user-tenants',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserTenant model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserTenant)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenant, {
            title: 'NewUserTenant',
            exclude: ['id'],
          }),
        },
      },
    })
    userTenant: Omit<UserTenant, 'id'>,
  ): Promise<UserTenant> {
    return this.userTenantRepository.create(userTenant);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewAnyUser,
      PermissionKey.ViewOwnUser,
      PermissionKey.ViewTenantUser,
      PermissionKey.ViewAnyUserNum,
      PermissionKey.ViewOwnUserNum,
      PermissionKey.ViewTenantUserNum,
    ],
  })
  @get('/user-tenants/count',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserTenant model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserTenant) where?: Where<UserTenant>,
  ): Promise<Count> {
    return this.userTenantRepository.count(where);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewAnyUser,
      PermissionKey.ViewOwnUser,
      PermissionKey.ViewTenantUser,
      PermissionKey.ViewAnyUserNum,
      PermissionKey.ViewOwnUserNum,
      PermissionKey.ViewTenantUserNum,
    ],
  })
  @get('/user-tenants',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Array of UserTenant model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserTenant, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserTenant) filter?: Filter<UserTenant>,
  ): Promise<UserTenant[]> {
    return this.userTenantRepository.find(filter);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserTenant,
    ],
  })
  @patch('/user-tenants',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserTenant PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenant, {partial: true}),
        },
      },
    })
    userTenant: UserTenant,
    @param.where(UserTenant) where?: Where<UserTenant>,
  ): Promise<Count> {
    return this.userTenantRepository.updateAll(userTenant, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewAnyUser,
      PermissionKey.ViewOwnUser,
      PermissionKey.ViewTenantUser,
      PermissionKey.ViewAnyUserNum,
      PermissionKey.ViewOwnUserNum,
      PermissionKey.ViewTenantUserNum,
    ],
  })
  @get('/user-tenants/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserTenant model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserTenant, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserTenant, {exclude: 'where'}) filter?: FilterExcludingWhere<UserTenant>
  ): Promise<UserTenant> {
    return this.userTenantRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserTenant,
    ],
  })
  @patch('/user-tenants/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserTenant PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenant, {partial: true}),
        },
      },
    })
    userTenant: UserTenant,
  ): Promise<void> {
    await this.userTenantRepository.updateById(id, userTenant);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserTenant,
    ],
  })
  @put('/user-tenants/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserTenant PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userTenant: UserTenant,
  ): Promise<void> {
    await this.userTenantRepository.replaceById(id, userTenant);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteUserTenant,
    ],
  })
  @del('/user-tenants/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserTenant DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userTenantRepository.deleteById(id);
  }
}
