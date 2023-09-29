import {
  Application,
  Binding,
  Component,
  ContextTags,
  ControllerClass,
  CoreBindings,
  ProviderMap,
  config,
  inject,
  injectable,
} from '@loopback/core';
import { Class, Model, Repository } from '@loopback/repository';
import { CoreComponent, TenantUtilitiesComponent } from '@sourceloop/core';
import { GroupUserController, TenantController, TenantGroupController, TenantRoleController, TenantTenantConfigController, TenantUserController, UserTenantController, UserTenantPrefsController, UserTenantUserGroupController, UserTenantUserLevelPermissionController } from './controllers';
import { GroupTenantInterceptor, TenantInterceptorInterceptor, UserTenantInterceptorInterceptor } from './interceptors';
import { UserTenantServiceComponentBindings, UserTenantServiceKey } from './keys';
import { AuthClient, Role, Tenant, TenantConfig, User, UserCredentials, UserDto, UserGroup, UserInvitation, UserLevelPermission, UserTenant, UserTenantPrefs, UserView } from './models';
import { Group } from './models/group.model';
import { AuthClientRepository, GroupRepository, RoleRepository, TenantConfigRepository, TenantRepository, UserCredentialsRepository, UserGroupRepository, UserInvitationRepository, UserLevelPermissionRepository, UserRepository, UserTenantPrefsRepository, UserTenantRepository, UserViewRepository } from './repositories';
import { UserGroupService, UserOperationsService } from './services';
import { DEFAULT_USER_SERVICE_OPTIONS, UserTenantServiceComponentOptions } from './types';

// Configure the binding for UserTenantServiceComponent
@injectable({ tags: { [ContextTags.KEY]: UserTenantServiceComponentBindings.COMPONENT } })
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
    this.bindings = [];
    this.application.component(CoreComponent);
    this.application.bind(UserTenantServiceKey.UserGroupService).toClass(UserGroupService);
    this.application.bind(UserTenantServiceKey.UserOperationsService).toClass(UserOperationsService);
    this.application.component(TenantUtilitiesComponent);

    this.application.bind(UserTenantServiceKey.GroupTenantInterceptor).toProvider(GroupTenantInterceptor);
    this.application.bind(UserTenantServiceKey.TenantInterceptorInterceptor).toProvider(TenantInterceptorInterceptor);
    this.application.bind(UserTenantServiceKey.UserTenantInterceptorInterceptor).toProvider(UserTenantInterceptorInterceptor);
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
      UserDto
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
      AuthClientRepository
    ];
  }
}
