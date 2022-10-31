// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {PermissionKey} from '../enums';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  TenantStatus,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize, AuthorizeErrorKeys} from 'loopback4-authorization';
import {Tenant, TenantConfig} from '../models';
import {TenantConfigRepository, TenantRepository} from '../repositories';

const basePath = '/tenants';

export class TenantController {
  constructor(
    @repository(TenantRepository)
    public tenantRepository: TenantRepository,
    @repository(TenantConfigRepository)
    public tenantConfigRepository: TenantConfigRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateTenant, PermissionKey.CreateTenantNum],
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Tenant)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Tenant, {
            title: 'NewTenant',
            exclude: ['id', 'status'],
          }),
        },
      },
    })
    tenant: Omit<Tenant, 'id'>,
  ): Promise<Tenant> {
    tenant.status = TenantStatus.ACTIVE;
    return this.tenantRepository.create(tenant);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewTenant, PermissionKey.ViewTenantNum],
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Tenant) where?: Where<Tenant>): Promise<Count> {
    return this.tenantRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewTenant, PermissionKey.ViewTenantNum],
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Tenant model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Tenant, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Tenant) filter?: Filter<Tenant>): Promise<Tenant[]> {
    return this.tenantRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateTenant, PermissionKey.UpdateTenantNum],
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Tenant, {partial: true}),
        },
      },
    })
    tenant: Tenant,
    @param.where(Tenant) where?: Where<Tenant>,
  ): Promise<Count> {
    return this.tenantRepository.updateAll(tenant, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewTenant,
      PermissionKey.ViewTenantNum,
      PermissionKey.ViewOwnTenantNum,
      PermissionKey.ViewOwnTenant,
    ],
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Tenant, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.path.string('id') id: string,
    @param.filter(Tenant, {exclude: 'where'})
    filter?: FilterExcludingWhere<Tenant>,
  ): Promise<Tenant> {
    if (
      currentUser.permissions.indexOf(PermissionKey.ViewOwnTenant) < 0 &&
      currentUser.tenantId !== id
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return this.tenantRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateTenant,
      PermissionKey.UpdateTenantNum,
      PermissionKey.UpdateOwnTenantNum,
      PermissionKey.UpdateOwnTenant,
    ],
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tenant PATCH success',
      },
    },
  })
  async updateById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Tenant, {partial: true}),
        },
      },
    })
    tenant: Tenant,
  ): Promise<void> {
    if (
      currentUser.permissions.indexOf(PermissionKey.ViewOwnTenant) < 0 &&
      currentUser.tenantId !== id
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    await this.tenantRepository.updateById(id, tenant);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteTenant, PermissionKey.DeleteTenantUser],
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tenant DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tenantRepository.deleteById(id);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewTenant,
      PermissionKey.ViewTenantNum,
      PermissionKey.ViewOwnTenantNum,
      PermissionKey.ViewOwnTenant,
    ],
  })
  @get(`${basePath}/{id}/config`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant config instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TenantConfig),
            },
          },
        },
      },
    },
  })
  async getTenantConfig(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.path.string('id') id: string,
  ): Promise<TenantConfig[]> {
    if (
      currentUser.permissions.indexOf(PermissionKey.ViewOwnTenant) < 0 &&
      currentUser.tenantId !== id
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return this.tenantConfigRepository.find({
      where: {
        tenantId: id,
      },
    });
  }
}
