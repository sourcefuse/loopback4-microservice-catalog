// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  CoreBindings,
  createServiceBinding,
  inject,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {UserTenantServiceComponent as JugglerUserTenantServiceComponent} from './component';
import {
  GroupUserController,
  TenantController,
  TenantGroupController,
  TenantRoleController,
  TenantTenantConfigController,
  TenantUserController,
  UserTenantController,
  UserTenantPrefsController,
  UserTenantUserGroupController,
  UserTenantUserLevelPermissionController,
} from './controllers/sequelize';
import {
  GroupTenantInterceptor,
  TenantInterceptorInterceptor,
  UserTenantInterceptorInterceptor,
} from './interceptors/sequelize';
import {UserTenantServiceComponentBindings, UserTenantServiceKey} from './keys';
import {
  AuthClient,
  Role,
  Tenant,
  TenantConfig,
  User,
  UserCredentials,
  UserDto,
  UserGroup,
  UserInvitation,
  UserLevelPermission,
  UserTenant,
  UserTenantPrefs,
  UserView,
} from './models';
import {Group} from './models/group.model';
import {
  AuthClientRepository,
  GroupRepository,
  RoleRepository,
  TenantConfigRepository,
  TenantRepository,
  UserCredentialsRepository,
  UserGroupRepository,
  UserInvitationRepository,
  UserLevelPermissionRepository,
  UserRepository,
  UserTenantPrefsRepository,
  UserTenantRepository,
  UserViewRepository,
} from './repositories/sequelize';
import {UserGroupService, UserOperationsService} from './services/sequelize';
import {IUserServiceConfig} from './types';

export class UserTenantServiceComponent extends JugglerUserTenantServiceComponent {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    protected application: RestApplication,
    @inject(UserTenantServiceComponentBindings.Config, {optional: true})
    protected readonly config?: IUserServiceConfig,
  ) {
    super(application, config);
    this.bindings = [];

    this.bindings = [
      createServiceBinding(UserGroupService),
      createServiceBinding(UserOperationsService),
      Binding.bind(UserTenantServiceKey.GroupTenantInterceptor).toProvider(
        GroupTenantInterceptor,
      ),
      Binding.bind(
        UserTenantServiceKey.TenantInterceptorInterceptor,
      ).toProvider(TenantInterceptorInterceptor),
      Binding.bind(
        UserTenantServiceKey.UserTenantInterceptorInterceptor,
      ).toProvider(UserTenantInterceptorInterceptor),
    ];

    this.models = [
      Role,
      UserTenant,
      TenantConfig,
      Tenant,
      UserView,
      Group,
      UserGroup,
      User,
      UserCredentials,
      UserLevelPermission,
      UserInvitation,
      UserTenantPrefs,
      AuthClient,
      UserDto,
    ];
    this.controllers = [
      TenantRoleController,
      TenantController,
      UserTenantController,
      GroupUserController,
      TenantTenantConfigController,
      TenantGroupController,
      TenantUserController,
      UserTenantPrefsController,
      UserTenantUserGroupController,
      UserTenantUserLevelPermissionController,
    ];
    this.repositories = [
      RoleRepository,
      UserTenantRepository,
      TenantConfigRepository,
      TenantRepository,
      UserRepository,
      UserCredentialsRepository,
      UserViewRepository,
      GroupRepository,
      UserGroupRepository,
      UserInvitationRepository,
      UserTenantPrefsRepository,
      UserLevelPermissionRepository,
      AuthClientRepository,
    ];
  }
}
