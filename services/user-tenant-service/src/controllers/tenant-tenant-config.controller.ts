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
import {Tenant, TenantConfig} from '../models';
import {TenantConfigRepository, TenantRepository} from '../repositories';
import {
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey, STATUS_CODE} from '../enums';
import {inject, intercept} from '@loopback/core';
import {UserTenantServiceKey} from '../keys';
const baseUrl = '/tenants/{id}/tenant-configs';

@intercept(UserTenantServiceKey.TenantInterceptorInterceptor)
export class TenantTenantConfigController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
    @repository(TenantConfigRepository)
    protected tenantConfigRepository: TenantConfigRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewTenant, PermissionKey.ViewTenantNum],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Tenant has many TenantConfig',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TenantConfig)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<TenantConfig>,
  ): Promise<TenantConfig[]> {
    return this.tenantRepository.tenantConfigs(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateTenant, PermissionKey.CreateTenantNum],
  })
  @post(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(TenantConfig)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Tenant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantConfig, {
            title: 'NewTenantConfigInTenant',
            exclude: ['id', 'tenantId'],
          }),
        },
      },
    })
    tenantConfig: Omit<TenantConfig, 'id'>,
  ): Promise<TenantConfig> {
    if (this.currentUser.tenantId) {
      tenantConfig.tenantId = this.currentUser.tenantId;
    }
    const configExists = await this.tenantConfigRepository.findOne({
      where: {
        tenantId: tenantConfig.tenantId,
        configKey: tenantConfig.configKey,
      },
    });
    if (configExists) {
      await this.tenantConfigRepository.updateById(configExists.id, {
        configValue: tenantConfig.configValue,
      });
      return tenantConfig;
    }

    return this.tenantConfigRepository.create(tenantConfig);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateTenant, PermissionKey.UpdateTenantNum],
  })
  @patch(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant.TenantConfig PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantConfig, {
            title: 'NewTenantConfigInTenant',
            exclude: ['id', 'tenantId'],
            partial: true,
          }),
        },
      },
    })
    tenantConfig: Partial<TenantConfig>,
    @param.query.object('where', getWhereSchemaFor(TenantConfig))
    where?: Where<TenantConfig>,
  ): Promise<Count> {
    return this.tenantRepository.tenantConfigs(id).patch(tenantConfig, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteTenant, PermissionKey.DeleteTenantUser],
  })
  @del(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant.TenantConfig DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(TenantConfig))
    where?: Where<TenantConfig>,
  ): Promise<Count> {
    return this.tenantRepository.tenantConfigs(id).delete(where);
  }
}
