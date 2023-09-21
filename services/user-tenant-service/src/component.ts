import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
  Binding,
  ControllerClass,
  ProviderMap,
} from '@loopback/core';
import {CoreComponent, TenantUtilitiesComponent} from '@sourceloop/core';
import {UserTenantServiceComponentBindings} from './keys'
import {DEFAULT_USER_SERVICE_OPTIONS, UserTenantServiceComponentOptions} from './types';
import { Class, Model, Repository } from '@loopback/repository';
import { AuthClient, Role, Tenant, TenantConfig, User, UserCredentials, UserGroup, UserInvitation, UserLevelPermission, UserTenant, UserTenantPrefs, UserView } from './models';
import { GroupController, GroupUserGroupController, RoleController, RoleUserTenantController, RoleUserViewController, TenantConfigTenantController, TenantController, TenantTenantConfigController, TenantUserController, TenantUserTenantController, UserController, UserCredentialsUserController, UserGroupController, UserGroupGroupController, UserGroupUserTenantController, UserInvitationUserTenantController, UserLevelPermissionUserTenantController, UserTenantController, UserTenantPrefsController, UserTenantPrefsUserTenantController, UserTenantRoleController, UserTenantTenantController, UserTenantUserController, UserTenantUserGroupController, UserTenantUserInvitationController, UserTenantUserLevelPermissionController, UserUserCredentialsController, UserUserTenantController, UserViewController } from './controllers';
import { AuthClientRepository, GroupRepository, RoleRepository, TenantConfigRepository, TenantRepository, UserCredentialsRepository, UserGroupRepository, UserInvitationRepository, UserLevelPermissionRepository, UserRepository, UserTenantPrefsRepository, UserTenantRepository, UserViewRepository } from './repositories';
import { Group } from './models/group.model';
import { UserGroupService } from './services/user-group.service';
import { UserGroupHelperService } from './services';

// Configure the binding for UserTenantServiceComponent
@injectable({tags: {[ContextTags.KEY]: UserTenantServiceComponentBindings.COMPONENT}})
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
    private application: Application,
    @config()
    private options: UserTenantServiceComponentOptions = DEFAULT_USER_SERVICE_OPTIONS,
  ) {
    this.bindings=[];
    this.application.component(CoreComponent);
    this.application.bind('services.UserGroupService').toClass(UserGroupService);
    this.application.bind('services.UserGroupHelperService').toClass(UserGroupHelperService);
    // this.application.bind('services.UserOperationsService').toClass(UserOperationsService);
    this.application.component(TenantUtilitiesComponent);
    this.models=[
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
      AuthClient
    ];
    this.controllers=[
      RoleController,
      RoleUserTenantController,
      TenantController,
      UserTenantController,
      TenantUserTenantController,
      GroupUserGroupController,
      GroupController,
      TenantTenantConfigController,
      RoleUserViewController,
      TenantConfigTenantController,
      UserGroupController,
      UserGroupGroupController,
      UserGroupUserTenantController,
      TenantUserController,
      UserTenantPrefsController,
      UserController,
      UserCredentialsUserController,
      UserTenantRoleController,
      UserTenantUserController,
      UserUserTenantController,
      UserTenantTenantController,
      UserUserCredentialsController,
      UserInvitationUserTenantController,
      UserTenantUserInvitationController,
      UserTenantUserGroupController,
      UserTenantUserLevelPermissionController,
      UserTenantPrefsUserTenantController,
      UserLevelPermissionUserTenantController,
      UserViewController
    ];
    this.repositories=[
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
      AuthClientRepository
    ];
  }
}
