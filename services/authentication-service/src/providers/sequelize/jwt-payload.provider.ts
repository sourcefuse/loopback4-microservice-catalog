// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  AuthorizationBindings,
  UserPermissionsFn,
} from 'loopback4-authorization';
import {UserTenantRepository} from '../../repositories';
import {
  RoleRepository,
  TenantConfigRepository,
  UserLevelPermissionRepository,
} from '../../repositories/sequelize';
import {JwtPayloadProvider as JugglerJwtPayloadProvider} from '../jwt-payload.provider';

export class JwtPayloadProvider extends JugglerJwtPayloadProvider {
  constructor(
    @repository(RoleRepository)
    protected readonly roleRepo: RoleRepository,
    @repository(UserLevelPermissionRepository)
    protected readonly utPermsRepo: UserLevelPermissionRepository,
    @repository(UserTenantRepository)
    protected readonly userTenantRepo: UserTenantRepository,
    @repository(TenantConfigRepository)
    protected readonly tenantConfigRepo: TenantConfigRepository,
    @inject(AuthorizationBindings.USER_PERMISSIONS)
    protected readonly getUserPermissions: UserPermissionsFn<string>,
    @inject(LOGGER.LOGGER_INJECT) protected readonly logger: ILogger,
  ) {
    super(
      roleRepo,
      utPermsRepo,
      userTenantRepo,
      tenantConfigRepo,
      getUserPermissions,
      logger,
    );
  }
}
