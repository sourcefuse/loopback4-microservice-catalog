// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {Filter, WhereBuilder, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  IAuthUserWithPermissions,
  ILogger,
  LOGGER,
  UserStatus,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {AuthorizeErrorKeys} from 'loopback4-authorization';

import {Tenant, User, UserDto, UserTenant, UserView} from '../models';
import {
  RoleRepository,
  TenantRepository,
  UserGroupRepository,
  UserRepository,
  UserTenantRepository,
  UserViewRepository,
} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class UserOperationsService {
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
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
  ) {}

  async create(userDtoData: UserDto, tenantId: string): Promise<User> {
    const tenant = await this.tenantRepository.findById(tenantId);
    await this._validateUserCreation(userDtoData, tenant);
    const role = await this.roleRepository.findById(userDtoData.roleId);
    let userToReturn: User;
    const currentUserToken = await this.getCurrentUser();
    const currentUser = await this.userRepository.findById(
      currentUserToken.id ?? '',
    );
    const userInDB = await this.userRepository.findOne({
      where: {
        or: [{username: userDtoData.username}, {email: userDtoData.email}],
      },
    });

    if (userInDB) {
      const userTenantExists = await this.userTenantRepository.findOne({
        where: {
          userId: userInDB.id,
          tenantId,
        },
      });
      if (userTenantExists) {
        throw new HttpErrors.Conflict(`User Already Exists`);
      }
      userToReturn = userInDB;
    } else {
      // user creation
      userDtoData.authClientIds = `{${(
        currentUser.authClientIds as unknown as number[]
      ).join()}}`;
      userDtoData.defaultTenantId = tenantId;

      userToReturn = await this.userRepository.create({
        firstName: userDtoData.firstName,
        lastName: userDtoData.lastName,
        middleName: userDtoData.middleName,
        username: userDtoData.username,
        email: userDtoData.email,
        phone: userDtoData.phone,
        authClientIds: userDtoData.authClientIds,
        photoUrl: userDtoData.photoUrl,
        gender: userDtoData.gender,
        dob: userDtoData.dob,
        designation: userDtoData.designation,
        defaultTenantId: userDtoData.defaultTenantId,
      });
    }

    await this.userTenantRepository.create({
      locale: userDtoData.locale,
      status: UserStatus.REGISTERED,
      userId: userToReturn.id,
      roleId: role.id,
      tenantId,
    });

    return userToReturn;
  }

  async find(
    tenantId: string,
    filter?: Filter<UserView>,
    permissions?: string[],
  ) {
    const currentUser = await this.getCurrentUser();
    const currentUserTenantId = currentUser.tenantId;
    if (currentUserTenantId !== tenantId) {
      throw new HttpErrors.Unauthorized();
    }
    const whereBuilder = new WhereBuilder<User>(filter?.where ?? {});

    const userTenantsWhere = new WhereBuilder({
      tenantId: tenantId,
    });
    const userTenants = await this.userTenantRepository.find({
      where: userTenantsWhere.build(),
    });
    whereBuilder.and({
      id: {
        inq: userTenants.map(userTenant => userTenant.userId),
      },
    });
    if (filter) {
      filter.where = whereBuilder.build();
    } else {
      filter = {
        where: whereBuilder.build(),
      };
    }
    return this.userViewRepository.find(filter);
  }

  async updateById(
    userData: Omit<
      UserView,
      | 'id'
      | 'authClientIds'
      | 'lastLogin'
      | 'tenantId'
      | 'tenantKey'
      | 'roleName'
      | 'userTenantId'
    >,
    userId: string,
    tenantId: string,
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (tenantId !== currentUser.tenantId) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    if (userData.username) {
      const whereBuilder = new WhereBuilder();
      whereBuilder.neq('id', userId);
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
      await this.userRepository.updateById(userId, tempUser);
    }

    await this.updateUserTenant(userData, userId, currentUser);
  }

  async updateUserTenant(
    userData: Partial<UserDto>,
    id: string,
    currentUser: IAuthUserWithPermissions,
  ) {
    const utData: Partial<UserTenant> = {};
    if (userData.roleId && id === currentUser.id) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    } else if (userData.roleId) {
      utData.roleId = userData.roleId;
    } else {
      //nothing
    }
    if (userData.status) {
      utData.status = userData.status;
    }
    if (utData && Object.keys(utData).length > 0) {
      await this.userTenantRepository.updateAll(utData, {
        userId: id,
        tenantId: userData.tenantId ?? currentUser.tenantId,
      });
    }
  }

  async deleteById(id: string, tenantId: string): Promise<void> {
    const currentUser = await this.getCurrentUser();
    const existingUserTenant = await this.userTenantRepository.findOne({
      where: {
        userId: id,
        tenantId: currentUser.tenantId,
      },
    });
    await this.userGroupRepository.deleteAll({
      userTenantId: existingUserTenant?.id,
    });
    await this.userTenantRepository.deleteAll({
      userId: id,
      tenantId: currentUser.tenantId,
    });
    const ut = await this.userTenantRepository.findOne({
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

  private async _validateUserCreation(userDtoData: UserDto, tenant: Tenant) {
    const currentUser = await this.getCurrentUser();
    if (tenant.id !== currentUser.tenantId) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }

    userDtoData.email = userDtoData.email.toLowerCase().trim();
    userDtoData.username = userDtoData.username.toLowerCase().trim();

    // Check for valid email
    // sonarignore:start
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // sonarignore:end
    if (userDtoData.email && !emailRegex.test(userDtoData.email)) {
      throw new HttpErrors.BadRequest(`Invalid Email`);
    }
  }
}
