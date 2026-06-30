// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {HttpErrors} from '@loopback/rest';
import {RevokedTokenRepository} from '../../../../repositories';
import {AuthenticateErrorKeys} from '../../../../enums/auth-error-keys.enum';
import {ILogger} from '../../../../components/logger-extension';

/**
 * Checks if a token has been revoked and throws an error if it has.
 *
 * This function queries the RevokedTokenRepository to determine if the given token
 * has been revoked. If the token is found in the revoked list, an Unauthorized
 * error is thrown, preventing the use of previously logged-out tokens.
 *
 * @param token - The JWT token to check for revocation
 * @param revokedTokenRepo - The repository to check for revoked tokens
 * @param logger - Logger instance for security and error logging
 * @throws {HttpErrors.Unauthorized} When the token has been revoked
 */
export async function checkIfTokenRevoked(
  token: string,
  revokedTokenRepo: RevokedTokenRepository,
  logger: ILogger,
): Promise<void> {
  try {
    const isRevoked = await revokedTokenRepo.get(token);
    if (isRevoked?.token) {
      logger.warn(`[SECURITY] Attempt to use revoked token detected`);
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.TokenRevoked);
    }
  } catch (error) {
    // Re-throw HTTP errors (like our TokenRevoked error)
    if (HttpErrors.HttpError.prototype.isPrototypeOf(error)) {
      throw error;
    }
    // Log but don't fail on repository errors to allow graceful degradation
    logger.error(
      `[AUTH] Revoked token repository error during token verification.`,
      error,
    );
  }
}
