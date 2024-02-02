import {inject, Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthClient,
  AuthClientRepository,
  SamlSignUpFn,
  TenantRepository,
  User,
  UserCredentialsRepository,
  UserRelations,
  UserRepository,
} from '@sourceloop/authentication-service';
import {AuthenticationBindings} from 'loopback4-authentication';
import {RoleRepository} from '../repositories';

export class SamlSignupProvider implements Provider<SamlSignUpFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(TenantRepository)
    public tenantRepository: TenantRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @repository(RoleRepository)
    private readonly roleRepo: RoleRepository,
    @repository(TenantRepository)
    private readonly tenantRepo: TenantRepository,
    @repository(UserRepository)
    private readonly userRepo: UserRepository,
    @repository(AuthClientRepository)
    private readonly authClientRepo: AuthClientRepository,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    private readonly client: AuthClient | undefined,
  ) {}

  value(): SamlSignUpFn {
    return async profile => {
      // Find 1st tenant associated with this client_id
      const [tenant, role, client] = await Promise.all([
        this.tenantRepo.findOne({
          where: {
            key: 'master',
          },
        }),
        this.roleRepo.findOne({
          where: {
            roleType: 0,
          },
        }),
        this.authClientRepo.findOne({
          where: {
            clientId: 'test_client_id',
          },
        }),
      ]);

      const userExists = await this.userRepo.findOne({
        where: {
          or: [{username: profile.email}, {email: profile.email}],
        },
      });
      if (userExists) {
        throw new HttpErrors.BadRequest('User already exists');
      }
      const user = await this.userRepo.createWithoutPassword({
        username: profile.email,
        firstName: String(profile.first_name),
        lastName: String(profile.last_name),
        email: profile.email,
        defaultTenantId: tenant?.id,
        authClientIds: `{${client?.id}}`,
      });

      await this.userRepo.credentials(user.id).create({
        userId: user.id,
        authProvider: 'saml',
        authId: profile.ID,
      });

      await this.userRepo.userTenants(user.id).create({
        userId: user.id,
        tenantId: tenant?.id,
        roleId: role?.id,
      });
      return user as User & UserRelations;
    };
  }
}
