// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER, UserStatus} from '@sourceloop/core';
import {AuthErrorKeys} from 'loopback4-authentication';
import {AuthClient, IAuthClientDTO, UserTenant} from '..';
import {AuthUser} from '../modules/auth/models/auth-user.model';
import {UserTenantRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class LoginHelperService {
  constructor(
    @repository(UserTenantRepository)
    private readonly userTenantRepo: UserTenantRepository,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
  ) {}

  async verifyClientUserLogin(
    req: IAuthClientDTO,
    client?: AuthClient,
    reqUser?: Pick<AuthUser, 'id' | 'authClientIds'> | null,
  ): Promise<Pick<UserTenant, 'status'> | null> {
    const currentUser = reqUser;
    if (!client) {
      this.logger.error('Auth client not found or invalid');
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    if (!currentUser) {
      this.logger.error('Auth user not found or invalid');
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }

    const userStatus: Pick<UserTenant, 'status'> | null =
      await this.userTenantRepo.findOne({
        where: {
          userId: currentUser.id,
        },
        fields: {
          status: true,
        },
      });

    if (!currentUser.authClientIds || currentUser.authClientIds.length === 0) {
      this.logger.error('No allowed auth clients found for this user in DB');
      throw new HttpErrors.UnprocessableEntity(AuthErrorKeys.ClientUserMissing);

      // sonarignore:start
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if ((currentUser.authClientIds as any).indexOf(client.id ?? 0) < 0) {
      // sonarignore:end
      this.logger.error(
        'User is not allowed to access client id passed in request',
      );
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    } else if (userStatus?.status === UserStatus.REGISTERED) {
      this.logger.error('User is in registered state');
      throw new HttpErrors.BadRequest('User not active yet');
    } else {
      // Do nothing and move ahead
    }
    return userStatus;
  }
}
