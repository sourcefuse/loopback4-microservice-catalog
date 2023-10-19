// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, intercept} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  Where,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
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
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {
  AuthenticationBindings,
  STRATEGY,
  authenticate,
} from 'loopback4-authentication';
import {AuthorizeErrorKeys, authorize} from 'loopback4-authorization';
import {PermissionKey, STATUS_CODE} from '../enums';
import {UserTenantServiceKey} from '../keys';
import {UserLevelPermission, UserTenant} from '../models';
import {UserTenantRepository} from '../repositories';
import {UserTenantRepository as SequelizeUserTenantRepository} from '../repositories/sequelize'
const baseUrl = '/user-tenants/{id}/user-level-permissions';

@intercept(UserTenantServiceKey.UserTenantInterceptorInterceptor)
export class UserTenantUserLevelPermissionController {
  constructor(
    @repository(UserTenantRepository)
    protected userTenantRepository: UserTenantRepository|SequelizeUserTenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected readonly currentUser: IAuthUserWithPermissions,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewUserTenant],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of UserLevelPermissions of UserTenant',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserLevelPermission),
            },
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
      PermissionKey.CreateUserTenant,
      PermissionKey.CreateUserPermissions,
    ],
  })
  @post(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'UserLevelPermission model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(UserLevelPermission)},
        },
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
            optional: ['userTenantId'],
          }),
        },
      },
    })
    userLevelPermission: Omit<UserLevelPermission, 'id'>,
  ): Promise<UserLevelPermission> {
    if (id === this.currentUser.userTenantId) {
      throw new HttpErrors.Forbidden('user can not change its own permission');
    }
    return this.userTenantRepository
      .userLevelPermissions(id)
      .create(userLevelPermission);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserTenant,
      PermissionKey.UpdateUserPermissions,
    ],
  })
  @patch(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
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
    @param.query.object('where', getWhereSchemaFor(UserLevelPermission))
    where?: Where<UserLevelPermission>,
  ): Promise<Count> {
    if (id === this.currentUser.userTenantId) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return this.userTenantRepository
      .userLevelPermissions(id)
      .patch(userLevelPermission, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteUserTenant],
  })
  @del(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'UserTenant.UserLevelPermission DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserLevelPermission))
    where?: Where<UserLevelPermission>,
  ): Promise<Count> {
    if (id === this.currentUser.userTenantId) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return this.userTenantRepository.userLevelPermissions(id).delete(where);
  }
}
