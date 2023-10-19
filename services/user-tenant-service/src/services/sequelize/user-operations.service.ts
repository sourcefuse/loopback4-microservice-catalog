// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {Getter, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IAuthUserWithPermissions, ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

import {
  RoleRepository,
  TenantRepository,
  UserGroupRepository,
  UserRepository,
  UserTenantRepository,
  UserViewRepository,
} from '../../repositories/sequelize';
import {UserOperationsService as JugglerUserOperationsService} from '../user-operations.service';
export class UserOperationsService extends JugglerUserOperationsService {
  constructor(
    @repository(RoleRepository) readonly roleRepository: RoleRepository,
    @repository(UserRepository) readonly userRepository: UserRepository,
    @repository(UserViewRepository)
    readonly userViewRepository: UserViewRepository,
    @repository(TenantRepository) readonly tenantRepository: TenantRepository,
    @repository(UserGroupRepository)
    readonly userGroupRepository: UserGroupRepository,
    @repository(UserTenantRepository)
    readonly userTenantRepository: UserTenantRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @inject(LOGGER.LOGGER_INJECT) protected readonly logger: ILogger,
  ) {
    super(
      roleRepository,
      userRepository,
      userViewRepository,
      tenantRepository,
      userGroupRepository,
      userTenantRepository,
      getCurrentUser,
      logger,
    );
  }
}
