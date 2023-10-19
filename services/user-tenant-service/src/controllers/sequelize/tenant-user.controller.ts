// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {intercept, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserTenantServiceKey} from '../../keys';
import {TenantRepository, UserRepository} from '../../repositories/sequelize';
import {UserOperationsService} from '../../services/sequelize';
import {TenantUserController as JugglerTenantUserController} from '../tenant-user.controller';
@intercept(UserTenantServiceKey.TenantInterceptorInterceptor)
export class TenantUserController extends JugglerTenantUserController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
    @repository(UserRepository) protected userRepository: UserRepository,
    @service(UserOperationsService)
    protected userOperationsService: UserOperationsService,
  ) {
    super(tenantRepository, userRepository, userOperationsService);
  }
}
