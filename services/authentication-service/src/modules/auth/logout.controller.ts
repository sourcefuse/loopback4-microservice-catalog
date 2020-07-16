import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import {
  AuthenticateErrorKeys,
  CONTENT_TYPE,
  ErrorCodes,
  STATUS_CODE,
  SuccessResponse,
} from '@sourceloop/core';
import {authenticate, AuthErrorKeys, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

import {RefreshTokenRequest} from '../../models';
import {
  RefreshTokenRepository,
  RevokedTokenRepository,
} from '../../repositories';

export class LogoutController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
    @repository(RevokedTokenRepository)
    private readonly revokedTokens: RevokedTokenRepository,
    @repository(RefreshTokenRepository)
    public refreshTokenRepo: RefreshTokenRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize(['*'])
  @post('/logout', {
    description: 'To logout',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Success Response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {'x-ts-type': SuccessResponse},
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async logout(
    @param.header.string('Authorization', {
      description:
        'This is the access token which is required to authenticate user.',
    })
    auth: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(RefreshTokenRequest, {
            partial: true,
          }),
        },
      },
    })
    req: RefreshTokenRequest,
  ): Promise<SuccessResponse> {
    const token = auth?.replace(/bearer /i, '');
    if (!token || !req.refreshToken) {
      throw new HttpErrors.UnprocessableEntity(
        AuthenticateErrorKeys.TokenMissing,
      );
    }

    const refreshTokenModel = await this.refreshTokenRepo.get(req.refreshToken);
    if (!refreshTokenModel) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenExpired);
    }
    if (refreshTokenModel.accessToken !== token) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    await this.revokedTokens.set(token, {token});
    await this.refreshTokenRepo.delete(req.refreshToken);
    if (refreshTokenModel.pubnubToken) {
      await this.refreshTokenRepo.delete(refreshTokenModel.pubnubToken);
    }

    return new SuccessResponse({
      success: true,

      key: refreshTokenModel.userId,
    });
  }
}
