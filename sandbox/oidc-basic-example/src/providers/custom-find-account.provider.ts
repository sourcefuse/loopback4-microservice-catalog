import {BindingScope, Provider, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  FindAccountProviderFn,
  FindAccountResult,
  User,
  UserRepository,
} from '@sourceloop/oidc-service';

const defaultClaims = ['email'];
const claimsProfile =
  process.env.OIDC_CLAIMS_PROFILE?.split(',') ?? defaultClaims;

@injectable({
  scope: BindingScope.SINGLETON,
})
export class CustomFindAccountProvider implements Provider<FindAccountProviderFn> {
  constructor(
    @repository(UserRepository)
    protected userRepository: UserRepository,
  ) {}

  value(): FindAccountProviderFn {
    return async (
      ctx: unknown,
      sub: string,
      token: unknown,
    ): Promise<FindAccountResult> => {
      const [newUser] = await this.userRepository.find({
        where: {username: sub},
      });

      const userClaims: {[key: string]: User[keyof User] | undefined} = {};

      claimsProfile.forEach(claim => {
        if (newUser?.[claim as keyof User]) {
          userClaims[claim] = newUser[claim as keyof User];
        }
      });

      return {
        accountId: sub,
        claims: async (
          use: string,
          scope: string,
          claims: unknown,
          rejected: Array<string>,
        ) => {
          return {sub, ...userClaims};
        },
      };
    };
  }
}
