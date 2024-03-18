// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, intercept, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  Where,
  repository,
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
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {
  AuthenticationBindings,
  STRATEGY,
  authenticate,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey, STATUS_CODE} from '../enums';
import {UserTenantServiceKey} from '../keys';
import {Role} from '../models';
import {
  RoleRepository,
  TenantRepository,
  UserTenantRepository,
} from '../repositories';
import {TenantOperationsService} from '../services';

const baseUrl = '/tenants/{id}/roles';

@intercept(UserTenantServiceKey.TenantInterceptorInterceptor)
export class TenantRoleController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
    @repository(RoleRepository) protected roleRepository: RoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected currentUser: IAuthUserWithPermissions,
    @repository(UserTenantRepository)
    readonly userTenantRepository: UserTenantRepository,
    @service(TenantOperationsService)
    protected tenantOperationService: TenantOperationsService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewRoles, PermissionKey.ViewRolesNum],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Roles of Tenant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Role)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Role>,
  ): Promise<Role[]> {
    return this.tenantRepository.roles(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateRoles, PermissionKey.CreateRolesNum],
  })
  @post(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Role model instance',
        content: {'application/json': {schema: getModelSchemaRef(Role)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            title: 'NewRoleInTenant',
            exclude: ['id', 'tenantId'],
          }),
        },
      },
    })
    role: Omit<Role, 'id'>,
  ): Promise<Role> {
    return this.tenantOperationService.createRole(id, role);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateRoles, PermissionKey.UpdateRolesNum],
  })
  @patch(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant.Role PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            partial: true,
            exclude: ['id', 'tenantId'],
          }),
        },
      },
    })
    role: Partial<Role>,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<Count> {
    return this.tenantOperationService.updateRole(id, role, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteRoles, PermissionKey.DeleteRolesNum],
  })
  @del(`${baseUrl}/{roleId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tenant.Role DELETE success',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.path.string('roleId') roleId: string,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<void> {
    return this.tenantOperationService.deleteRole(id, roleId);
  }
}
