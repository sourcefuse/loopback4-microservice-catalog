// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  WhereBuilder,
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
  CONTENT_TYPE,
  STATUS_CODE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums';

import {Role, UserTenant} from '../models';
import {RoleRepository, UserTenantRepository} from '../repositories';

const basePath = '/roles/{id}/user-tenants';

export class RoleUserTenantController {
  constructor(
    @repository(RoleRepository)
    private readonly roleRepository: RoleRepository,
    @repository(UserTenantRepository)
    private readonly utRepo: UserTenantRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewRoles, PermissionKey.ViewRolesNum],
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Role has many UserTenant',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserTenant),
            },
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
    permissions: [PermissionKey.ViewRoles, PermissionKey.ViewRolesNum],
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'User tenant count for specified role id',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserTenant))
    where?: Where<UserTenant>,
  ): Promise<Count> {
    const whereBuilder = new WhereBuilder(where);
    whereBuilder.eq('roleId', id);
    return this.utRepo.count(whereBuilder.build());
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.NotAllowed, PermissionKey.NotAllowedNum],
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Role model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(UserTenant)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Role.prototype.id,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(UserTenant, {
            title: 'NewUserTenantInRole',
            exclude: ['id'],
            optional: ['roleId'],
          }),
        },
      },
    })
    userTenant: Omit<UserTenant, 'id'>,
  ): Promise<UserTenant> {
    return this.roleRepository.userTenants(id).create(userTenant);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.NotAllowed, PermissionKey.NotAllowedNum],
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Role.UserTenant PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(UserTenant, {partial: true}),
        },
      },
    })
    userTenant: Partial<UserTenant>,
    @param.query.object('where', getWhereSchemaFor(UserTenant))
    where?: Where<UserTenant>,
  ): Promise<Count> {
    return this.roleRepository.userTenants(id).patch(userTenant, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.NotAllowed, PermissionKey.NotAllowedNum],
  })
  @del(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Role.UserTenant DELETE success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserTenant))
    where?: Where<UserTenant>,
  ): Promise<Count> {
    return this.roleRepository.userTenants(id).delete(where);
  }
}
