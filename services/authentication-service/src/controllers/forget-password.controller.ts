import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  AuthenticateErrorKeys,
  CONTENT_TYPE,
  ErrorCodes,
  STATUS_CODE,
  SuccessResponse,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import * as jwt from 'jsonwebtoken';
import {
  authenticateClient,
  AuthenticationBindings,
  AuthErrorKeys,
  ClientAuthCode,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

import {
  AuthClient,
  ForgetPasswordDto,
  ForgetPasswordResponseDto,
  ResetPasswordWithClient,
  User,
} from '../models';
import {RevokedTokenRepository, UserRepository} from '../repositories';

export class ForgetPasswordController {
  constructor(
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(RevokedTokenRepository)
    public revokedTokensRepo: RevokedTokenRepository,
  ) {}

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authorize({permissions: ['*']})
  @post(`auth/forget-password`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Success Response.',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(ForgetPasswordResponseDto),
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async forgetPassword(
    @requestBody()
    req: ForgetPasswordDto,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    client: AuthClient,
  ): Promise<ForgetPasswordResponseDto> {
    const user = await this.userRepo.findOne({
      where: {
        username: req.username,
      },
    });
    if (!user || !user.id) {
      throw new HttpErrors.NotFound('User not found !');
    }

    if (!user.email) {
      throw new HttpErrors.UnprocessableEntity(
        'No email exists for the user !',
      );
    }

    try {
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
      const token = jwt.sign(codePayload, process.env.JWT_SECRET as string, {
        expiresIn: expiryDuration,
        audience: req.client_id,
        subject: user.username.toLowerCase(),
        issuer: process.env.JWT_ISSUER,
        algorithm: 'HS256',
      });
      return new ForgetPasswordResponseDto({
        code: token,
        expiry: expiryDuration,
        email: user.email,
        user,
      });
    } catch (error) {
      throw new HttpErrors.UnprocessableEntity(
        AuthErrorKeys.ClientVerificationFailed,
      );
    }
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
      payload = jwt.verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
        algorithms: ['HS256'],
      }) as ClientAuthCode<User>;
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

    let payload;

    const isRevoked = await this.revokedTokensRepo.get(req.token);
    if (isRevoked?.token) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.TokenRevoked);
    }

    try {
      payload = jwt.verify(req.token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
        algorithms: ['HS256'],
      }) as ClientAuthCode<User>;
    } catch (error) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenExpired);
    }

    if (!payload.clientId || !payload.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    await this.userRepo.changePassword(payload.user.username, req.password);

    await this.revokedTokensRepo.set(req.token, {
      token: req.token,
    });
  }
}
