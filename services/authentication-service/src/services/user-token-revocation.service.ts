// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  ILogger,
  LOGGER,
  UserTokensValidAfterRepository,
} from '@sourceloop/core';
import {AuthClientRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class UserTokenRevocationService {
  constructor(
    @repository(AuthClientRepository)
    private readonly authClientRepository: AuthClientRepository,
    @repository(UserTokensValidAfterRepository)
    private readonly userTokensValidAfterRepository: UserTokensValidAfterRepository,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
  ) {}

  /**
   * Revokes every access and refresh token issued to the user so far,
   * optionally only those of one tenant.
   */
  async revokeUserTokens(
    userId: string,
    options?: {tenantId?: string},
  ): Promise<void> {
    const clients = await this.authClientRepository.find({
      fields: {accessTokenExpiration: true, refreshTokenExpiration: true},
    });
    if (!clients.length) {
      return;
    }
    // The marker must outlive the longest-lived token any client can have issued
    const ttlSeconds = Math.max(
      ...clients.map(c =>
        Math.max(c.accessTokenExpiration, c.refreshTokenExpiration),
      ),
    );
    await this.userTokensValidAfterRepository.revoke(
      userId,
      ttlSeconds * 1000,
      options?.tenantId,
    );
    this.logger.info(
      `Revoked tokens issued so far to user ${userId}${
        options?.tenantId ? ` in tenant ${options.tenantId}` : ''
      }`,
    );
  }
}
