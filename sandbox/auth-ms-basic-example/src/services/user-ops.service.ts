// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, injectable} from '@loopback/core';
import {AnyObject, DataObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthClientRepository,
  LocalUserProfileDto,
  Role,
  RoleRepository,
  SignupRequestResponseDto,
  User,
  UserCredentials,
  UserRepository,
  UserTenantRepository,
} from '@sourceloop/authentication-service';
import {UserStatus} from '@sourceloop/core';
import {AuthenticateErrorKeys} from '@sourceloop/core/src/enums';
import bcrypt from 'bcrypt';
import {UserDto} from '../models/user.dto';
const saltRounds = 10;
const DEFAULT_TENANT_ID = '91afb1b3-15ef-66f9-b5c3-d9c4daaa0b34'; // tenant with this id needs to be present in db

@injectable({scope: BindingScope.TRANSIENT})
export class UserOpsService {
  constructor(
    @repository(RoleRepository)
    private readonly roleRepository: RoleRepository,
    @repository(UserRepository)
    private readonly userRepository: UserRepository,
    @repository(UserTenantRepository)
    private readonly utRepository: UserTenantRepository,
    @repository(AuthClientRepository)
    private readonly authClientsRepository: AuthClientRepository,
  ) {}

  createUserToken(dto: DataObject<SignupRequestResponseDto>) {
    console.log(dto); //NOSONAR
  }

  async createUser(user: LocalUserProfileDto, options: AnyObject) {
    const userDto = await this.prepareUserDto(user);
    this.validateUserCreation(userDto, options);

    await this.validateAuthClient(userDto.clientId);

    const existingUser = await this.findExistingUser(userDto);
    if (existingUser) {
      return this.handleExistingUser(existingUser, userDto, options);
    }

    return this.createNewUser(userDto, user, options);
  }

  private async prepareUserDto(user: LocalUserProfileDto): Promise<UserDto> {
    const role = await this.roleRepository.create(
      new Role({
        name: 'USER',
        tenantId: DEFAULT_TENANT_ID,
        roleType: 1,
      }),
    );

    return new UserDto({
      ...user,
      tenantId: DEFAULT_TENANT_ID,
      username: user.email,
      firstName: 'test',
      lastName: 'NA',
      roleId: role.id ?? '',
    });
  }

  private async validateAuthClient(clientId: string) {
    const authClient = await this.authClientsRepository.findOne({
      where: {clientId},
    });

    if (!authClient) {
      throw new HttpErrors.BadRequest('Invalid Client');
    }
  }

  private async findExistingUser(userDto: UserDto) {
    return this.userRepository.findOne({
      where: {
        or: [{username: userDto.username}, {email: userDto.email}],
      },
      fields: {id: true},
    });
  }

  private async handleExistingUser(
    existingUser: User,
    userDto: UserDto,
    options: AnyObject,
  ) {
    const userTenantExists = await this.utRepository.findOne({
      where: {
        userId: existingUser.id,
        tenantId: userDto.tenantId,
      },
    });

    if (userTenantExists) {
      throw new HttpErrors.BadRequest('User already exists');
    }

    const userTenant = await this.createUserTenantData(
      userDto,
      UserStatus.ACTIVE,
      existingUser?.id,
      options,
    );

    return new UserDto({
      roleId: userTenant.roleId,
      status: userTenant.status,
      tenantId: userTenant.tenantId,
      userTenantId: userTenant.id,
    });
  }

  private async createNewUser(
    userDto: UserDto,
    user: LocalUserProfileDto,
    options: AnyObject,
  ) {
    const authClient = await this.authClientsRepository.findOne({
      where: {clientId: userDto.clientId},
    });

    const userSaved = await this.userRepository.createWithoutPassword(
      new User({
        username: userDto.username?.toLowerCase() ?? 'NA',
        firstName: userDto.firstName ?? 'NA',
        lastName: userDto.lastName ?? 'NA',
        email: userDto.email ?? 'NA',
        phone: userDto.phone ?? 'NA',
        defaultTenantId: userDto.tenantId ?? 'NA',
        authClientIds: `{${authClient?.id}}`,
      }),
      options,
    );

    const userTenantData = await this.createUserTenantData(
      userDto,
      UserStatus.ACTIVE,
      userSaved?.id,
      options,
    );

    await this.setPassword(user.email, user.password);

    return new UserDto({
      roleId: userTenantData.roleId,
      status: userTenantData.status,
      tenantId: userTenantData.tenantId,
      userTenantId: userTenantData.id,
    });
  }

  validateUserCreation(userData: UserDto, options?: AnyObject) {
    // Check for valid email
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (userData.email && !emailRegex.test(userData.email)) {
      throw new HttpErrors.BadRequest('Email invalid.');
    }

    // Check for allowed domains
    const allowedDomains = (process.env.AUTO_SIGNUP_DOMAINS ?? '').split(',');
    const emailDomain = userData.email.split('@')[1];
    if (!(emailDomain && allowedDomains.length > 0)) {
      throw new HttpErrors.BadRequest(
        'Domain not supported, please enter a valid email',
      );
    }

    if (!allowedDomains.includes(emailDomain) && options) {
      options.authProvider = 'internal';
      return;
    }
    const e164RegEx = /^\+?[1-9]\d{1,14}$/;

    if (userData.phone && !e164RegEx.test(userData.phone)) {
      throw new HttpErrors.BadRequest('Phone number invalid.');
    }
  }

  async createUserTenantData(
    userData: UserDto,
    userStatus: UserStatus,
    userId?: string,
    options?: AnyObject,
  ) {
    return this.utRepository.create(
      {
        roleId: userData.roleId,
        status: userStatus,
        tenantId: userData.tenantId,
        userId,
      },
      options,
    );
  }

  async setPassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.userRepository.findOne({where: {email}});
    let creds;
    try {
      creds = user && (await this.userRepository.credentials(user.id).get());
    } catch (e) {
      //do nothing
    }
    if (!user || user.deleted) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (creds) {
      throw new HttpErrors.Unauthorized('User already signed up.');
    } else {
      // Do nothing
    }
    const password = await bcrypt.hash(newPassword, saltRounds);
    creds = new UserCredentials({
      authProvider: 'internal',
      password,
    });
    await this.userRepository.credentials(user.id).create(creds);
    return true;
  }
}
