// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  ContextTags,
  ControllerClass,
  CoreBindings,
  createServiceBinding,
  inject,
  injectable,
  ProviderMap,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  ServiceSequence,
  TenantUtilitiesComponent,
} from '@sourceloop/core';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
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
} from './controllers';
import {
  GroupTenantInterceptor,
  TenantInterceptorInterceptor,
  UserTenantInterceptorInterceptor,
} from './interceptors';
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
} from './repositories';
import {
  AuthClientRepository as AuthClientSequelizeRepository,
  GroupRepository as GroupSequelizeRepository,
  RoleRepository as RoleSequelizeRepository,
  TenantConfigRepository as TenantConfigSequelizeRepository,
  TenantRepository as TenantSequelizeRepository,
  UserCredentialsRepository as UserCredentialsSequelizeRepository,
  UserGroupRepository as UserGroupSequelizeRepository,
  UserInvitationRepository as UserInvitationSequelizeRepository,
  UserLevelPermissionRepository as UserLevelPermissionSequelizeRepository,
  UserRepository as UserSequelizeRepository,
  UserTenantPrefsRepository as UserTenantPrefsSequelizeRepository,
  UserTenantRepository as UserTenantSequelizeRepository,
  UserViewRepository as UserViewSequelizeRepository,
} from './repositories/sequelize';
import {
  TenantOperationsService,
  UserGroupService,
  UserOperationsService,
} from './services';
import {IUserServiceConfig} from './types';

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
    private application: RestApplication,
    @inject(UserTenantServiceComponentBindings.Config, {optional: true})
    private readonly config?: IUserServiceConfig,
  ) {
    this.bindings = [];

    this.application.component(CoreComponent);

    this.bindings = [
      createServiceBinding(UserGroupService),
      createServiceBinding(UserOperationsService),
      createServiceBinding(TenantOperationsService),
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
    this.application.component(TenantUtilitiesComponent);

    // Mount default sequence if needed
    if (!this.config?.useCustomSequence) {
      this.setupSequence();
    }
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
    if (this.config?.useSequelize) {
      this.repositories = [
        RoleSequelizeRepository,
        UserTenantSequelizeRepository,
        TenantConfigSequelizeRepository,
        TenantSequelizeRepository,
        UserSequelizeRepository,
        UserCredentialsSequelizeRepository,
        UserViewSequelizeRepository,
        GroupSequelizeRepository,
        UserGroupSequelizeRepository,
        UserInvitationSequelizeRepository,
        UserTenantPrefsSequelizeRepository,
        UserLevelPermissionSequelizeRepository,
        AuthClientSequelizeRepository,
      ];
    } else {
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
  setupSequence() {
    this.application.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    this.application.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.application.component(BearerVerifierComponent);

    // Mount authorization component for default sequence
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}
