import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthClientRepository,
  AzureAdSignUpFn,
  User,
  UserRelations,
} from '@sourceloop/authentication-service';
import {
  RoleRepository,
  TenantRepository,
  UserRepository,
} from '../repositories';

export class AzureAdSignupProvider implements Provider<AzureAdSignUpFn> {
  constructor(
    @repository(RoleRepository)
    private readonly roleRepo: RoleRepository,
    @repository(TenantRepository)
    private readonly tenantRepo: TenantRepository,
    @repository(AuthClientRepository)
    private readonly authClientRepo: AuthClientRepository,
    @repository(UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  value(): AzureAdSignUpFn {
    return async profile => {
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

      // check if user exist

      const userExists = await this.userRepo.findOne({
        where: {
          or: [{username: profile.upn}, {email: profile.upn}],
        },
      });
      if (userExists) {
        throw new HttpErrors.BadRequest('User already exists');
      }

      const user = await this.userRepo.createWithoutPassword({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        username: profile.upn,
        email: profile.upn,
        defaultTenantId: tenant?.id,
        authClientIds: `{${client?.id}}`,
      });

      await this.userRepo.credentials(user.id).create({
        userId: user.id,
        authProvider: 'azure',
        authId: profile.oid,
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
