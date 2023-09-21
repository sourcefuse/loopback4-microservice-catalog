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
  User,
  UserView,
} from '../models';
import {TenantRepository, UserViewRepository} from '../repositories';
import { PermissionKey } from '../enums';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';

export class TenantUserController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
    @repository(UserViewRepository) protected userViewRepository: UserViewRepository,
  ) { }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewAnyUser,
      PermissionKey.ViewTenantUser,
      PermissionKey.ViewTenantUserRestricted,
      PermissionKey.ViewAnyUserNum,
      PermissionKey.ViewTenantUserNum,
      PermissionKey.ViewTenantUserRestrictedNum,
    ],
  })
  @get('/tenants/{id}/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Tenant has many User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserView>,
  ): Promise<UserView[]> {
    // return this.tenantRepository.users(id).find(filter);
    return this.userViewRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateAnyUser,
      PermissionKey.CreateTenantUser,
      PermissionKey.CreateTenantUserRestricted,
      PermissionKey.CreateAnyUserNum,
      PermissionKey.CreateTenantUserNum,
      PermissionKey.CreateTenantUserRestrictedNum,
    ],
  })
  @post('/tenants/{id}/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tenant model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Tenant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInTenant',
            exclude: ['id'],
            optional: ['defaultTenantId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.tenantRepository.users(id).create(user);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateAnyUser,
      PermissionKey.UpdateOwnUser,
      PermissionKey.UpdateTenantUser,
      PermissionKey.UpdateTenantUserRestricted,
      PermissionKey.UpdateAnyUserNum,
      PermissionKey.UpdateOwnUserNum,
      PermissionKey.UpdateTenantUserNum,
      PermissionKey.UpdateTenantUserRestrictedNum,
    ],
  })
  @patch('/tenants/{id}/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tenant.User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.tenantRepository.users(id).patch(user, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteAnyUser,
      PermissionKey.DeleteTenantUser,
      PermissionKey.DeleteTenantUserRestricted,
      PermissionKey.DeleteAnyUserNum,
      PermissionKey.DeleteTenantUserNum,
      PermissionKey.DeleteTenantUserRestrictedNum,
    ],
  })
  @del('/tenants/{id}/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tenant.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.tenantRepository.users(id).delete(where);
  }
}
