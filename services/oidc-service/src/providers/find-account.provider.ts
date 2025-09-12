import {Provider, injectable, BindingScope, ContextTags} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {User} from '../models';
import {FindAccountProviderFn, FindAccountResult} from '../types';
import {OIDCServiceBindings} from '../keys';

const defaultClaims = ['firstName', 'lastName', 'email'];
const claimsProfile =
  process.env.OIDC_CLAIMS_PROFILE?.split(',') ?? defaultClaims;

@injectable({
  scope: BindingScope.SINGLETON,
  tags: {[ContextTags.KEY]: OIDCServiceBindings.FIND_ACCOUNT_PROVIDER},
})
export class FindAccountProvider implements Provider<FindAccountProviderFn> {
  constructor(
    @repository(UserRepository)
    protected userRepository: UserRepository,
  ) {}

  /**
   * The function returns a Promise that finds a user account based on a provided username and returns
   * account information and claims.
   * @returns The `value()` function is returning an asynchronous function that takes in context
   * (`ctx`), subject (`sub`), and token as parameters and returns a Promise of `FindAccountResult`.
   * Inside this function, it queries the user repository to find a user with the provided username
   * (`sub`), extracts certain user claims based on a predefined list (`claimsProfile`), and constructs
   * a response object with the account
   */
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
