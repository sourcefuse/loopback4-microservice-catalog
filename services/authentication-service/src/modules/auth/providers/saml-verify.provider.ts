import {inject, Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';

import * as SamlStrategy from '@node-saml/passport-saml';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  AuthErrorKeys,
  IAuthUser,
  VerifyFunction,
} from 'loopback4-authentication';
import {
  SamlPostVerifyFn,
  SamlPreVerifyFn,
  SamlSignUpFn,
} from '../../../providers';
import {AuthServiceBindings} from '../../../keys';
import {SignUpBindings, VerifyBindings} from '../../../providers/keys';
import {UserCredentialsRepository, UserRepository} from '../../../repositories';
import {
  encodeSamlSession,
  readSamlLogoutConfig,
  SAML_NAMEID_FORMAT_UNSPECIFIED,
} from '../../../services/saml-logout.service';
import type {IAuthServiceConfig} from '../../../types';
import {AuthUser} from '../models/auth-user.model';
export class SamlVerifyProvider implements Provider<VerifyFunction.SamlFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(SignUpBindings.SAML_SIGN_UP_PROVIDER)
    private readonly signupProvider: SamlSignUpFn,
    @inject(VerifyBindings.SAML_PRE_VERIFY_PROVIDER)
    private readonly preVerifyProvider: SamlPreVerifyFn,
    @inject(VerifyBindings.SAML_POST_VERIFY_PROVIDER)
    private readonly postVerifyProvider: SamlPostVerifyFn,
    @inject(AuthServiceBindings.Config, {optional: true})
    private readonly authConfig?: IAuthServiceConfig | null,
    @inject(LOGGER.LOGGER_INJECT, {optional: true})
    private readonly logger?: ILogger,
  ) {}

  value(): VerifyFunction.SamlFn {
    return async (profile: SamlStrategy.Profile) => {
      const email = profile.email;
      const lowerCasedEmail = email?.toLowerCase();
      let user: IAuthUser | null = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      // identity providers do not guarantee the casing of the email they
      // return, so retry with the canonical form before giving up
      if (!user && lowerCasedEmail !== email) {
        user = await this.userRepository.findOne({
          where: {
            email: lowerCasedEmail,
          },
        });
      }
      user = await this.preVerifyProvider(profile, user);
      if (!user) {
        const newUser = await this.signupProvider(profile);
        if (newUser) {
          user = newUser;
        } else {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
      }
      const creds = await this.userCredsRepository.findOne({
        where: {
          userId: user.id as string,
        },
      });
      if (creds?.authProvider !== 'saml' || creds?.authId !== profile.id) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }

      const authUser: AuthUser = new AuthUser({
        ...user,
        id: user.id as string,
      });
      authUser.permissions = [];
      const sessionRef = this.encodeSessionRef(profile);
      if (sessionRef) {
        authUser.externalAuthToken = sessionRef;
      }
      return this.postVerifyProvider(profile, authUser);
    };
  }

  /**
   * The encrypted IdP session reference kept in the refresh-token record for
   * SAML Single Logout (never in the JWT), or undefined unless the application
   * opted in, SLO is configured and the IdP returned a NameID.
   */
  private encodeSessionRef(profile: SamlStrategy.Profile): string | undefined {
    if (!this.authConfig?.samlSingleLogout) {
      return undefined;
    }
    const sloConfig = readSamlLogoutConfig();
    // opted in but no reference possible: SLO would silently do nothing at
    // logout, so say why here
    if (!sloConfig) {
      this.logger?.warn(
        '[SamlLogout] samlSingleLogout is enabled but the Single Logout environment is incomplete; no IdP session reference stored',
      );
      return undefined;
    }
    if (!profile.nameID) {
      this.logger?.warn(
        '[SamlLogout] The IdP returned no NameID; no IdP session reference stored',
      );
      return undefined;
    }
    try {
      return encodeSamlSession(
        {
          nameID: profile.nameID,
          // the Format attribute is optional; without it the stored ref would
          // not decode and Single Logout would silently become local-only
          nameIDFormat: profile.nameIDFormat ?? SAML_NAMEID_FORMAT_UNSPECIFIED,
          sessionIndex: profile.sessionIndex,
          nameQualifier: profile.nameQualifier,
          spNameQualifier: profile.spNameQualifier,
        },
        sloConfig.sessionSecret,
      );
    } catch (error) {
      // deliberate: Single Logout is optional, so a bad key degrades it to a
      // local-only logout instead of failing the login
      this.logger?.error(
        `[SamlLogout] Could not encrypt the IdP session reference; Single Logout disabled for this session :: ${
          error instanceof Error ? error.name : typeof error
        }`,
      );
      return undefined;
    }
  }
}
