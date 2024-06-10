// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors, get, param, patch, post, requestBody} from '@loopback/rest';
import {
  AuthProvider,
  AuthenticateErrorKeys,
  ErrorCodes,
  ILogger,
  LOGGER,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  SuccessResponse,
} from '@sourceloop/core';
import {omit} from 'lodash';
import {
  AuthErrorKeys,
  AuthenticationBindings,
  ClientAuthCode,
  STRATEGY,
  authenticateClient,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {AuthServiceBindings} from '../keys';
import {
  AuthClient,
  ForgetPasswordDto,
  ResetPasswordWithClient,
  User,
} from '../models';

import {
  AuthCodeBindings,
  ForgotPasswordHandlerFn,
  JWTSignerFn,
  JWTVerifierFn,
} from '../providers';
import {RevokedTokenRepository, UserRepository} from '../repositories';
import {LoginHelperService} from '../services';

export class ForgetPasswordController {
  constructor(
    @repository(UserRepository)
    private readonly userRepo: UserRepository,
    @repository(RevokedTokenRepository)
    private readonly revokedTokensRepo: RevokedTokenRepository,
    @inject('services.LoginHelperService')
    private readonly loginHelperService: LoginHelperService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthCodeBindings.JWT_SIGNER.key)
    private readonly jwtSigner: JWTSignerFn<AnyObject>,
    @inject(AuthCodeBindings.JWT_VERIFIER.key)
    private readonly jwtVerifier: JWTVerifierFn<AnyObject>,
  ) {}

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authorize({permissions: ['*']})
  @post(`auth/forget-password`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Success Response.',
      },
      ...ErrorCodes,
    },
  })
  async forgetPassword(
    @requestBody()
    req: ForgetPasswordDto,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    client: AuthClient,
    @inject(AuthServiceBindings.ForgotPasswordHandler)
    forgetPasswordHandler: ForgotPasswordHandlerFn,
  ): Promise<void> {
    const user = await this.userRepo.findOne({
      where: {
        username: req.username,
      },
      include: ['credentials'],
    });
    try {
      await this.loginHelperService.verifyClientUserLogin(req, client, user);
    } catch (e) {
      return;
    }
    if (!user?.id) {
      this.logger.info(`Forget password attempted for invalid user`);
      return;
    }

    if (!user.email) {
      this.logger.info(`Forget password attempted for user without email`);
      return;
    }

    const codePayload: ClientAuthCode<User> = {
      clientId: client.clientId,
      userId: parseInt(user.id),
      user: new User({
        id: user.id,
        email: user.email,
        username: user.username,
      }),
    };
    // Default expiry is 30 minutes
    const expiryDuration = parseInt(
      process.env.FORGOT_PASSWORD_LINK_EXPIRY ?? '1800',
    );
    const token = await this.jwtSigner(codePayload, {
      audience: req.client_id,
      subject: user.username.toLowerCase(),
      expiresIn: expiryDuration,
    });

    if (user?.credentials?.authProvider !== AuthProvider.INTERNAL) {
      throw new HttpErrors.BadRequest(
        AuthenticateErrorKeys.PasswordCannotBeChanged,
      );
    }

    await forgetPasswordHandler({
      code: token,
      expiry: expiryDuration,
      email: user.email,
      user: omit(user, 'credentials'),
    });
  }

  @authorize({permissions: ['*']})
  @get(`auth/verify-reset-password-link`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Check if Token Is Valid and not Expired.',
      },
    },
  })
  async verifyResetPasswordLink(
    @param.query.string('token', {required: true})
    token: string,
  ): Promise<SuccessResponse> {
    let payload;

    const isRevoked = await this.revokedTokensRepo.get(token);
    if (isRevoked?.token) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.TokenRevoked);
    }
    try {
      payload = (await this.jwtVerifier(token, {})) as ClientAuthCode<User>;
    } catch (error) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenExpired);
    }

    if (!payload.clientId || !payload.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }

    return new SuccessResponse({
      success: true,
    });
  }

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authorize({permissions: ['*']})
  @patch(`auth/reset-password`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'If User password successfully changed.',
      },
    },
  })
  async resetPassword(
    @requestBody()
    req: ResetPasswordWithClient,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    client: AuthClient,
  ): Promise<void> {
    if (!req.token) {
      throw new HttpErrors.UnprocessableEntity(
        AuthenticateErrorKeys.TokenMissing,
      );
    }

    if (req.password && req.password.length <= 0) {
      throw new HttpErrors.BadRequest(AuthenticateErrorKeys.PasswordInvalid);
    }

    let payload: ClientAuthCode<User>;

    const isRevoked = await this.revokedTokensRepo.get(req.token);
    if (isRevoked?.token) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.TokenRevoked);
    }

    try {
      payload = (await this.jwtVerifier(req.token, {})) as ClientAuthCode<User>;
    } catch (error) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenExpired);
    }

    if (!payload.clientId || !payload.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    const user = await this.userRepo.findOne({
      where: {
        username: payload.user.username,
      },
    });
    await this.loginHelperService.verifyClientUserLogin(req, client, user);

    await this.userRepo.changePassword(payload.user.username, req.password);

    await this.revokedTokensRepo.set(req.token, {
      token: req.token,
    });
  }
}
