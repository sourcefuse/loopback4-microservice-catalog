// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
  ControllerClass,
  Binding,
  ProviderMap,
} from '@loopback/core';
import {UserTenantServiceComponentBindings} from './keys';
import {CoreComponent} from '@sourceloop/core';
import {Class, Model, Repository} from '@loopback/repository';
import {
  DEFAULT_USER_TENANT_SERVICE_OPTIONS,
  UserTenantServiceComponentOptions,
} from './types';
import {
  AuthClient,
  GroupUserCountView,
  UserGroupView,
  Group,
  Role,
  TenantConfig,
  Tenant,
  UserCredentials,
  UserDto,
  UserGroup,
  UserLevelPermission,
  UserSignupCheckDto,
  UserTenantPrefs,
  UserTenant,
  UserView,
  User,
} from './models';
import {
  GroupController,
  HomePageController,
  PingController,
  RoleUserTenantController,
  RoleController,
  TenantUserController,
  TenantController,
  UserGroupController,
  UserGroupsController,
  UserSignupController,
  UserTenantPrefsController,
  UserTenantController,
} from './controllers';
import {
  AuthClientRepository,
  UserGroupCountViewRepository,
  GroupRepository,
  NonRestrictedUserViewRepository,
  RoleRepository,
  TenantConfigRepository,
  TenantRepository,
  UserCredentialsRepository,
  UserGroupViewRepository,
  UserGroupRepository,
  UserLevelPermissionRepository,
  UserTenantPrefsRepository,
  UserTenantRepository,
  UserViewRepository,
  UserRepository,
} from './repositories';

// Configure the binding for UserTenantServiceComponent
@injectable({
  tags: {[ContextTags.KEY]: UserTenantServiceComponentBindings.COMPONENT},
})
export class UserTenantServiceComponent implements Component {
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];
  bindings?: Binding[] = [];
  providers?: ProviderMap = {};
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: Application,
    @config()
    private readonly options: UserTenantServiceComponentOptions = DEFAULT_USER_TENANT_SERVICE_OPTIONS,
  ) {
    this.bindings = [];
    this.application.component(CoreComponent);
    this.models = [
      AuthClient,
      GroupUserCountView,
      UserGroupView,
      Group,
      Role,
      TenantConfig,
      Tenant,
      UserCredentials,
      UserDto,
      UserGroup,
      UserLevelPermission,
      UserSignupCheckDto,
      UserTenantPrefs,
      UserTenant,
      UserView,
      User,
    ];
    this.controllers = [
      GroupController,
      HomePageController,
      PingController,
      RoleUserTenantController,
      RoleController,
      TenantUserController,
      TenantController,
      UserGroupController,
      UserGroupsController,
      UserSignupController,
      UserTenantPrefsController,
      UserTenantController,
    ];
    this.repositories = [
      AuthClientRepository,
      UserGroupCountViewRepository,
      GroupRepository,
      NonRestrictedUserViewRepository,
      RoleRepository,
      TenantConfigRepository,
      TenantRepository,
      UserCredentialsRepository,
      UserGroupViewRepository,
      UserGroupRepository,
      UserLevelPermissionRepository,
      UserTenantPrefsRepository,
      UserTenantRepository,
      UserViewRepository,
      UserRepository,
    ];
  }
}
