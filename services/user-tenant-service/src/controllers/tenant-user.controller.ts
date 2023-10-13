// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {intercept, service} from '@loopback/core';
import {Filter, Where, repository} from '@loopback/repository';
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
import {OPERATION_SECURITY_SPEC} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey, STATUS_CODE} from '../enums';
import {UserTenantServiceKey} from '../keys';
import {User, UserDto, UserView} from '../models';
import {TenantRepository, UserRepository} from '../repositories';
import {UserOperationsService} from '../services';
const baseUrl = '/tenants/{id}/users';

@intercept(UserTenantServiceKey.TenantInterceptorInterceptor)
export class TenantUserController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
    @repository(UserRepository) protected userRepository: UserRepository,
    @service(UserOperationsService)
    protected userOperationsService: UserOperationsService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewTenantUser,
      PermissionKey.ViewTenantUserNum,
    ],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Users of Tenant',
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
    return this.userOperationsService.find(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateTenantUser,
      PermissionKey.CreateTenantUserNum,
    ],
  })
  @post(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDto, {
            title: 'NewUserInTenant',
            exclude: ['id', 'defaultTenantId'],
          }),
        },
      },
    })
    user: UserDto,
  ): Promise<User> {
    user.defaultTenantId = id;
    return this.userOperationsService.create(user, id);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateTenantUser,
      PermissionKey.UpdateTenantUserNum,
    ],
  })
  @patch(`${baseUrl}/{userId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tenant.User PATCH',
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @param.path.string('userId') userId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Omit<
      UserView,
      'id' | 'authClientIds' | 'lastLogin' | 'status' | 'tenantId'
    >,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<void> {
    await this.userOperationsService.updateById(user, userId, id);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteTenantUser,
      PermissionKey.DeleteTenantUserNum,
    ],
  })
  @del(`${baseUrl}/{userId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tenant.User DELETE',
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.path.string('userId') userId: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<void> {
    await this.userOperationsService.deleteById(userId, id);
  }
}
