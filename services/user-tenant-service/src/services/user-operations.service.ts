// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {PermissionKey, RoleTypeMap, RoleTypeMapValue} from '../enums';
import {bind, BindingScope} from '@loopback/core';
import {Options, repository, Where, WhereBuilder} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {IAuthUserWithPermissions, UserStatus} from '@sourceloop/core';
import {AuthorizeErrorKeys} from 'loopback4-authorization';
import {
  Role,
  User,
  UserDto,
  UserTenant,
  UserTenantWithRelations,
  UserView,
} from '../models';
import {
  AuthClientRepository,
  RoleRepository,
  UserGroupRepository,
  UserRepository,
  UserTenantRepository,
} from '../repositories';

@bind({scope: BindingScope.TRANSIENT})
export class UserOperationsService {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository,
    @repository(UserTenantRepository)
    private readonly utRepo: UserTenantRepository,
    @repository(RoleRepository)
    private readonly roleRepo: RoleRepository,
    @repository(AuthClientRepository)
    private readonly authClientsRepo: AuthClientRepository,
    @repository(UserGroupRepository)
    private readonly userGroupRepository: UserGroupRepository,
  ) {}

  async create(
    userData: UserDto,
    currentUser: IAuthUserWithPermissions,
    options?: Options,
  ): Promise<UserDto> {
    const user = userData.userDetails;
    this.validateUserCreation(user, userData, currentUser, options);

    const role: Role = await this.roleRepo.findById(userData.roleId);
    const roleType = (RoleTypeMap[role.roleType] as RoleTypeMapValue)
      .permissionKey;

    const userExists = await this.userRepository.findOne({
      where: {
        or: [{username: user.username}, {email: user.email}],
      },
      fields: {
        id: true,
      },
    });
    if (userExists) {
      const userTenantExists = await this.utRepo.findOne({
        where: {
          userId: userExists.id,
          tenantId: userData.tenantId,
        },
      });
      if (userTenantExists) {
        throw new HttpErrors.BadRequest('User already exists');
      } else {
        if (
          currentUser.tenantId === userData.tenantId &&
          currentUser.permissions.indexOf(
            PermissionKey.CreateTenantUserRestricted,
          ) >= 0 &&
          currentUser.permissions.indexOf(`CreateTenant${roleType}`) < 0
        ) {
          throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
        }
        const userTenant: UserTenant = await this.createUserTenantData(
          userData,
          UserStatus.REGISTERED,
          userExists?.id,
          options,
        );
        return new UserDto({
          userDetails: userExists,
          roleId: userTenant.roleId,
          status: userTenant.status,
          tenantId: userTenant.tenantId,
          userTenantId: userTenant.id,
          authProvider: options?.authProvider,
        });
      }
    }

    if (
      currentUser.tenantId === userData.tenantId &&
      currentUser.permissions.indexOf(
        PermissionKey.CreateTenantUserRestricted,
      ) >= 0 &&
      currentUser.permissions.indexOf(`CreateTenant${roleType}`) < 0
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    const authClients = await this.authClientsRepo.find({
      where: {
        clientId: {
          inq: role.allowedClients,
        },
      },
    });
    const authClientIds = authClients.map(client => client.id);
    user.authClientIds = `{${authClientIds.join(',')}}`;
    const username = user.username;
    user.username = username.toLowerCase();
    //Override default tenant id
    user.defaultTenantId = userData.tenantId;
    const userSaved = await this.userRepository.create(user, options);
    const userTenantData = await this.createUserTenantData(
      userData,
      UserStatus.REGISTERED,
      userSaved?.id,
      options,
    );
    return new UserDto({
      userDetails: userSaved,
      roleId: userTenantData.roleId,
      status: userTenantData.status,
      tenantId: userTenantData.tenantId,
      userTenantId: userTenantData.id,
      authProvider: options?.authProvider,
    });
  }

  validateUserCreation(
    user: User,
    userData: UserDto,
    currentUser: IAuthUserWithPermissions,
    options?: Options,
  ) {
    if (
      currentUser.permissions.indexOf(PermissionKey.CreateTenantUser) >= 0 &&
      currentUser.tenantId !== userData.tenantId
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }

    user.email = user?.email?.toLowerCase().trim();

    // Check for valid email
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (user.email && !emailRegex.test(user.email)) {
      throw new HttpErrors.BadRequest('Email invalid.');
    }

    // Check for allowed domains
    const allowedDomains = (process.env.AUTO_SIGNUP_DOMAINS ?? '').split(',');
    const emailDomain = user.email.split('@')[1];
    if (!(emailDomain && allowedDomains.length > 0)) {
      throw new HttpErrors.BadRequest(
        'Domain not supported, please enter a valid email',
      );
    }

    if (
      allowedDomains &&
      allowedDomains.length === 1 &&
      allowedDomains[0] === '*' &&
      options
    ) {
      options.authProvider = 'keycloak';
    } else if (!allowedDomains.includes(emailDomain) && options) {
      options.authProvider = options.authProvider || 'internal';
    } else {
      // Do nothing
    }
  }

  async createUserTenantData(
    userData: UserDto,
    userStatus: UserStatus,
    userId?: string,
    options?: Options,
  ) {
    return this.utRepo.create(
      {
        roleId: userData.roleId,
        status: userStatus,
        tenantId: userData.tenantId,
        userId,
      },
      options,
    );
  }

  async updateById(
    currentUser: IAuthUserWithPermissions,
    id: string,
    userData: Omit<
      UserView,
      'id' | 'authClientIds' | 'lastLogin' | 'status' | 'tenantId'
    >,
    tenantId: string,
  ): Promise<void> {
    await this.checkForUpdatePermissions(currentUser, id, tenantId);

    if (userData.username) {
      const whereBuilder = new WhereBuilder();
      whereBuilder.neq('id', id);
      whereBuilder.eq('username', userData.username);
      const userNameExists = await this.userRepository.count(
        whereBuilder.build(),
      );
      if (userNameExists && userNameExists.count > 0) {
        throw new HttpErrors.Forbidden('Username already exists');
      }
    }

    const tempUser = new User({
      ...userData,
    });

    if (tempUser) {
      await this.userRepository.updateById(id, tempUser);
    }

    await this.updateUserTenant(userData, id, currentUser);
  }

  async updateUserTenant(
    userData: Partial<UserDto>,
    id: string,
    currentUser: IAuthUserWithPermissions,
  ) {
    const utData: Partial<UserTenant> = {};
    if (userData.roleId) {
      utData.roleId = userData.roleId;
    }
    if (userData.status) {
      utData.status = userData.status;
    }
    if (utData && Object.keys(utData).length > 0) {
      await this.utRepo.updateAll(utData, {
        userId: id,
        tenantId: userData.tenantId ?? currentUser.tenantId,
      });
    }
  }

  async deleteById(
    currentUser: IAuthUserWithPermissions,
    id: string,
    tenantId: string,
  ): Promise<void> {
    await this.checkForDeleteTenantUserRestrictedPermission(currentUser, id);

    await this.checkForDeleteTenantUserPermission(currentUser, id);

    await this.checkForDeleteAnyUserPermission(currentUser, tenantId);

    const existingUserTenant = await this.utRepo.findOne({
      where: {
        userId: id,
        tenantId: currentUser.tenantId,
      },
    });
    await this.userGroupRepository.deleteAll({
      userTenantId: existingUserTenant?.id,
    });
    await this.utRepo.deleteAll({
      userId: id,
      tenantId: currentUser.tenantId,
    });
    const ut = await this.utRepo.findOne({
      where: {
        userId: id,
      },
    });
    let defaultTenantId = null;
    if (ut && ut !== null) {
      defaultTenantId = ut.tenantId;
    }
    await this.userRepository.updateById(id, {
      // eslint-disable-next-line
      //@ts-ignore
      defaultTenantId: defaultTenantId,
    });
  }

  async checkViewTenantRestrictedPermissions(
    currentUser: IAuthUserWithPermissions,
    where?: Where<UserView>,
  ): Promise<Where<UserView>> {
    const whereBuilder = new WhereBuilder<UserView>();
    const role = await this.roleRepo.find();
    const allowedRoles: string[] = [];
    role.forEach(r => {
      if (
        r.id &&
        currentUser.permissions.indexOf(
          `ViewTenant${
            (RoleTypeMap[r.roleType] as RoleTypeMapValue).permissionKey
          }`,
        ) >= 0
      ) {
        allowedRoles.push(r.id);
      }
    });

    if (where) {
      whereBuilder.and(
        {
          roleId: {
            inq: allowedRoles,
          },
        },
        where,
      );
    } else {
      whereBuilder.inq('roleId', allowedRoles);
    }
    return whereBuilder.build();
  }

  async checkForDeleteTenantUserRestrictedPermission(
    currentUser: IAuthUserWithPermissions,
    id: string,
  ) {
    if (
      currentUser.permissions.indexOf(
        PermissionKey.DeleteTenantUserRestricted,
      ) >= 0
    ) {
      const userTenant = (await this.utRepo.findOne({
        where: {
          userId: id,
          tenantId: currentUser.tenantId,
        },
        include: [
          {
            relation: 'role',
          },
        ],
      })) as UserTenantWithRelations;
      if (
        !userTenant ||
        currentUser.permissions.indexOf(
          `DeleteTenant${
            (RoleTypeMap[userTenant.role.roleType] as RoleTypeMapValue)
              .permissionKey
          }`,
        ) < 0
      ) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }
    }
  }

  async checkForDeleteTenantUserPermission(
    currentUser: IAuthUserWithPermissions,
    id: string,
  ) {
    if (currentUser.permissions.indexOf(PermissionKey.DeleteTenantUser) >= 0) {
      const userTenant = await this.utRepo.findOne({
        where: {
          userId: id,
          tenantId: currentUser.tenantId,
        },
      });
      if (!userTenant) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }
    }
  }

  async checkForDeleteAnyUserPermission(
    currentUser: IAuthUserWithPermissions,
    tenantId: string,
  ) {
    if (
      currentUser.permissions.indexOf(PermissionKey.DeleteAnyUser) < 0 &&
      tenantId !== currentUser.tenantId
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
  }

  async checkForUpdatePermissions(
    currentUser: IAuthUserWithPermissions,
    id: string,
    tenantId?: string,
  ) {
    if (
      currentUser.permissions.indexOf(PermissionKey.UpdateOwnUser) >= 0 &&
      currentUser.id !== id
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }

    if (
      currentUser.tenantId === tenantId &&
      currentUser.permissions.indexOf(
        PermissionKey.UpdateTenantUserRestricted,
      ) >= 0 &&
      currentUser.id !== id
    ) {
      const userTenant = (await this.utRepo.findOne({
        where: {
          userId: id,
          tenantId: currentUser.tenantId,
        },
        include: [
          {
            relation: 'role',
          },
        ],
      })) as UserTenantWithRelations;
      if (
        !userTenant ||
        currentUser.permissions.indexOf(
          `UpdateTenant${
            (RoleTypeMap[userTenant.role.roleType] as RoleTypeMapValue)
              .permissionKey
          }`,
        ) < 0
      ) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }
    }

    if (currentUser.permissions.indexOf(PermissionKey.UpdateTenantUser) >= 0) {
      const userTenant = await this.utRepo.findOne({
        where: {
          userId: id,
          tenantId: currentUser.tenantId,
        },
      });
      if (!userTenant) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }
    }

    if (
      currentUser.permissions.indexOf(PermissionKey.UpdateAnyUser) < 0 &&
      tenantId !== currentUser.tenantId
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
  }

  async getUserTenant(userId: string, currentUser: IAuthUserWithPermissions) {
    return this.utRepo.findOne({
      where: {
        userId: userId,
        tenantId: currentUser.tenantId,
      },
      include: [{relation: 'role'}],
    });
  }
}
