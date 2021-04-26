import {inject, Provider} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthenticateErrorKeys,
  ConfigKey,
  getAge,
  ILogger,
  LOGGER,
} from '@sourceloop/core';
import {AuthErrorKeys, IAuthClient, IAuthUser} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  UserPermissionsFn,
} from 'loopback4-authorization';

import {AuthClient, User, UserTenant} from '../models';
import {AuthUser} from '../modules/auth';
import {
  RoleRepository,
  TenantConfigRepository,
  UserLevelPermissionRepository,
  UserTenantRepository,
} from '../repositories';
import {IDeviceInfo, JwtPayloadFn} from './types';

export class JwtPayloadProvider implements Provider<JwtPayloadFn> {
  constructor(
    @repository(RoleRepository)
    private readonly roleRepo: RoleRepository,
    @repository(UserLevelPermissionRepository)
    private readonly utPermsRepo: UserLevelPermissionRepository,
    @repository(UserTenantRepository)
    private readonly userTenantRepo: UserTenantRepository,
    @repository(TenantConfigRepository)
    private readonly tenantConfigRepo: TenantConfigRepository,
    @inject(AuthorizationBindings.USER_PERMISSIONS)
    private readonly getUserPermissions: UserPermissionsFn<string>,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
  ) {}

  value() {
    return async (
      authUserData: IAuthUser,
      authClient: IAuthClient,
      deviceInfo?: IDeviceInfo,
    ) => {
      const user = authUserData as User;
      const userTenant = await this.userTenantRepo.findOne({
        where: {
          userId: (user as User).id,
          tenantId: user.defaultTenantId,
        },
      });

      if (!userTenant) {
        throw new HttpErrors.Unauthorized(
          AuthenticateErrorKeys.UserDoesNotExist,
        );
      }

      if (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        user.authClientIds.indexOf(authClient.id || 0) < 0
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
      }

      // Create user DTO for payload to JWT
      const authUser: AuthUser = new AuthUser(Object.assign({}, user));
      this._removeUnnecessaryData(authUser);

      // Add locale info
      await this._setLocale(authUser, userTenant);

      authUser.deviceInfo = deviceInfo;
      authUser.authClientId = (authClient as AuthClient).id ?? 0;
      authUser.tenantId = userTenant.tenantId;
      authUser.userTenantId = userTenant.id;
      authUser.status = userTenant.status;
      const role = await this.roleRepo.findById(userTenant.roleId);
      if (!role) {
        this.logger.error('Role not found for the user');
        throw new HttpErrors.UnprocessableEntity(
          AuthenticateErrorKeys.UnprocessableData,
        );
      }

      const utPerms = await this.utPermsRepo.find({
        where: {
          userTenantId: userTenant.id,
        },
        fields: {
          permission: true,
          allowed: true,
        },
      });
      authUser.permissions = this.getUserPermissions(utPerms, role.permissions);
      authUser.role = role.roleType?.toString();
      if (authUser.dob) {
        const age = getAge(new Date(authUser.dob));
        authUser.age = age;
      }
      return authUser.toJSON();
    };
  }

  private _removeUnnecessaryData(authUser: AnyObject) {
    delete authUser.externalAuthToken;
    delete authUser.externalRefreshToken;
    delete authUser.createdBy;
    delete authUser.createdOn;
    delete authUser.deleted;
    delete authUser.deletedBy;
    delete authUser.deletedOn;
    delete authUser.modifiedBy;
    delete authUser.modifiedOn;
    return authUser;
  }

  private async _setLocale(authUser: AuthUser, userTenant: UserTenant) {
    if (userTenant.locale && userTenant.locale.length > 0) {
      // Use locale from user preferences first
      authUser.userPreferences = {locale: userTenant.locale};
    } else {
      // Use tenant config locale at second priority
      const config = await this.tenantConfigRepo.findOne({
        where: {
          configKey: ConfigKey.Profile,
        },
      });

      // Use locale from environment as fallback overall
      let locale = process.env.LOCALE ?? 'en';
      if (config?.configValue) {
        // sonarignore:start
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        locale = (config.configValue as any).locale;
        // sonarignore:end
      }
      authUser.userPreferences = {
        locale,
      };
    }
  }
}
