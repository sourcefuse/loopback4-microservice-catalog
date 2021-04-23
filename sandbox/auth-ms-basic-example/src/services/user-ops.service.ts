import {BindingScope, injectable} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  User,
  UserCredentials,
  UserTenant,
} from '@sourceloop/authentication-service/dist/models';
import {
  AuthClientRepository,
  RoleRepository,
  UserRepository,
  UserTenantRepository,
} from '@sourceloop/authentication-service/dist/repositories';
import {UserStatus} from '@sourceloop/core';
import {AuthenticateErrorKeys} from '@sourceloop/core/src/enums';
import bcrypt from 'bcrypt';
import {UserDto} from '../models/user.dto';
const saltRounds = 10;

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

  async createUser(user: UserDto, options: AnyObject) {
    this.validateUserCreation(user, options);

    const authClient = await this.authClientsRepository.findOne({
      where: {
        clientId: user.clientId,
      },
    });

    if (!authClient) {
      throw new HttpErrors.BadRequest('Invalid Client');
    }

    const userExists = await this.userRepository.findOne({
      where: {
        or: [{username: user.username}, {email: user.email}],
      },
      fields: {
        id: true,
      },
    });
    if (userExists) {
      const userTenantExists = await this.utRepository.findOne({
        where: {
          userId: userExists.id,
          tenantId: user.tenantId,
        },
      });
      if (userTenantExists) {
        throw new HttpErrors.BadRequest('User already exists');
      } else {
        const userTenant: UserTenant = await this.createUserTenantData(
          user,
          UserStatus.ACTIVE,
          userExists?.id,
          options,
        );
        return new UserDto({
          roleId: userTenant.roleId,
          status: userTenant.status,
          tenantId: userTenant.tenantId,
          userTenantId: userTenant.id,
        });
      }
    }

    const username = user.username;
    user.username = username.toLowerCase();
    //Override default tenant id
    const userSaved = await this.userRepository.createWithoutPassword(
      new User({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        defaultTenantId: user.tenantId,
        authClientIds: `{${authClient?.id}}`,
      }),
      options,
    );

    const userTenantData = await this.createUserTenantData(
      user,
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
    const emailRegex = new RegExp(
      "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
    );
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
