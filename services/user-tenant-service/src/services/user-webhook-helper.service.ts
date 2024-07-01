import {Setter, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserStatus} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserWebhookDTO} from '../models';
import {
  AuthClientRepository,
  RoleRepository,
  TenantRepository,
  UserCredentialsRepository,
  UserRepository,
  UserTenantRepository,
} from '../repositories';
import {TempUser} from '../types';

export class UserWebhookHelperService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @repository(TenantRepository)
    public tenantRepository: TenantRepository,
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @repository(UserTenantRepository)
    public userTenantRepository: UserTenantRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @inject.setter(AuthenticationBindings.CURRENT_USER)
    private readonly setCurrentUser: Setter<TempUser>,
  ) {}

  public async create(payload: UserWebhookDTO) {
    const tenant = await this.tenantRepository.create({
      name: payload.tenantName,
      key: payload.tenantKey,
      status: 1, // active
    });

    const role = await this.roleRepository.create({
      name: process.env.FIRST_USER_ROLE!,
      tenantId: tenant.id,
      permissions: process.env.SUPER_ADMIN_PERMISSIONS?.split(','), //NOSONAR
    });

    const authClient = await this.authClientRepository.create({
      clientId: payload.authClient?.clientId,
      clientSecret: payload.authClient?.clientSecret,
      redirectUrl: payload.authClient?.redirectUrl,
      secret: payload.authClient?.secret,
      accessTokenExpiration: payload.authClient?.accessTokenExpiration,
      refreshTokenExpiration: payload.authClient?.refreshTokenExpiration,
      authCodeExpiration: payload.authClient?.authCodeExpiration,
    });

    const user = await this.userRepository.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      middleName: payload.middleName,
      username: payload.email,
      email: payload.email,
      phone: payload.phone,
      authClientIds: `{${authClient.id}}`,
      defaultTenantId: tenant.id,
    });

    await this.userTenantRepository.create({
      status: UserStatus.REGISTERED,
      userId: user.id,
      roleId: role.id,
      tenantId: tenant.id,
    });

    await this.userCredentialsRepository.create({
      authProvider: 'aws-cognito',
      authId: payload.cognitoAuthId,
      userId: user.id,
    });

    return user;
  }
}
