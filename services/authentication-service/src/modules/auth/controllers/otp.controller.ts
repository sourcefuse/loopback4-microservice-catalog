// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors, get, param, post, requestBody} from '@loopback/rest';
import {
  AuthenticateErrorKeys,
  CONTENT_TYPE,
  ErrorCodes,
  ILogger,
  LOGGER,
  STATUS_CODE,
} from '@sourceloop/core';
import * as jwt from 'jsonwebtoken';
import {
  AuthErrorKeys,
  AuthenticationBindings,
  ClientAuthCode,
  STRATEGY,
  authenticate,
  authenticateClient,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {authenticator} from 'otplib';
import qrcode from 'qrcode';
import {OtpMethodType} from '../../../enums';
import {AuthServiceBindings} from '../../../keys';
import {User, UserCredentials} from '../../../models';
import {
  AuthCodeBindings,
  CodeReaderFn,
  CodeWriterFn,
  JWTVerifierFn,
  MfaCheckFn,
  VerifyBindings,
} from '../../../providers';
import {
  AuthClientRepository,
  OtpCacheRepository,
  UserCredentialsRepository,
  UserRepository,
} from '../../../repositories';
import {IMfaConfig, IOtpConfig} from '../../../types';
import {
  AuthTokenRequest,
  AuthUser,
  OtpLoginRequest,
  OtpSendRequest,
} from '../models';
import {
  CodeResponse,
  QrCodeCheckResponse,
  QrCodeCreateResponse,
} from '../types';

export class OtpController {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(OtpCacheRepository)
    public otpCacheRepo: OtpCacheRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(VerifyBindings.MFA_PROVIDER)
    private readonly checkMfa: MfaCheckFn,
    @inject(AuthCodeBindings.JWT_VERIFIER.key)
    private readonly jwtVerifier: JWTVerifierFn<AnyObject>,
    @inject(AuthServiceBindings.MfaConfig, {optional: true})
    private readonly mfaConfig: IMfaConfig,
    @inject(AuthServiceBindings.OtpConfig, {optional: true})
    private readonly otpConfig: IOtpConfig,
  ) {}

  // OTP
  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authenticate(STRATEGY.OTP)
  @authorize({permissions: ['*']})
  @post('/auth/send-otp', {
    description: 'Sends OTP',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Sends otp to user',
        content: {
          [CONTENT_TYPE.JSON]: Object,
        },
      },
      ...ErrorCodes,
    },
  })
  async sendOtp(
    @requestBody()
    req: OtpSendRequest,
  ): Promise<void> {
    // This is intentional
  }

  @authenticate(STRATEGY.OTP)
  @authorize({permissions: ['*']})
  @post('/auth/verify-otp', {
    description:
      'Gets you the code that will be used for getting token (webapps)',
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'Auth Code that you can use to generate access and refresh tokens using the POST /auth/token API',
        content: {
          [CONTENT_TYPE.JSON]: Object,
        },
      },
      ...ErrorCodes,
    },
  })
  async verifyOtp(
    @requestBody()
    req: OtpLoginRequest,
    @inject(AuthenticationBindings.CURRENT_USER)
    user: AuthUser,
    @inject(AuthCodeBindings.CODEWRITER_PROVIDER)
    codeWriter: CodeWriterFn,
  ): Promise<CodeResponse> {
    let otpCache;
    let clientId!: string;
    let userId;
    let clientSecret!: jwt.Secret;
    const isMfaEnabled = await this.checkMfa(user);
    if (isMfaEnabled) {
      if (
        this.mfaConfig.secondFactor === STRATEGY.OTP &&
        this.otpConfig.method === OtpMethodType.OTP
      ) {
        otpCache = await this.otpCacheRepo.get(req.key);
        if (user?.id) {
          otpCache.userId = user.id;
        }

        clientId = otpCache.clientId;
        userId = otpCache.userId;
        clientSecret = otpCache.clientSecret;
      } else if (
        this.mfaConfig.secondFactor === STRATEGY.OTP &&
        this.otpConfig.method === OtpMethodType.GOOGLE_AUTHENTICATOR
      ) {
        if (!req.clientId) {
          throw new Error(
            'Client ID must be provided for Google Authenticator',
          );
        }
        clientId = req.clientId;
        userId = user.id;
        const client = await this.authClientRepository.findOne({
          where: {
            clientId,
          },
        });
        clientSecret = client?.clientSecret as string;
      } else {
        // This is intentional.
      }
    }

    const codePayload: ClientAuthCode<User, typeof User.prototype.id> = {
      clientId: clientId,
      userId: userId,
    };
    const token = await codeWriter(
      jwt.sign(codePayload, clientSecret, {
        expiresIn: 180,
        audience: clientId,
        issuer: process.env.JWT_ISSUER,
        algorithm: 'HS256',
      }),
    );
    return {
      code: token,
    };
  }

  // Google Authenticator
  @authorize({permissions: ['*']})
  @get('/auth/check-qr-code', {
    description: 'Returns isGenerated:true if secret_key already exist',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'secret_key already exists',
        content: {
          [CONTENT_TYPE.JSON]: Object,
        },
      },
      ...ErrorCodes,
    },
  })
  async checkQr(
    @param.header.string('code') code: string,
    @param.header.string('clientId') clientId: string,
    @inject(AuthCodeBindings.CODEREADER_PROVIDER)
    codeReader: CodeReaderFn,
  ): Promise<QrCodeCheckResponse> {
    if (!clientId) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    if (!code) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    const authClient = await this.authClientRepository.findOne({
      where: {
        clientId: clientId,
      },
    });
    if (!authClient) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    try {
      const authCode = await codeReader(code);
      const payload = (await this.jwtVerifier(authCode, {
        audience: clientId,
      })) as ClientAuthCode<User, typeof User.prototype.id>;

      const userId = payload.userId ?? payload.user?.id;

      const userCreds: Pick<UserCredentials, 'secretKey'> | null =
        await this.userCredsRepository.findOne({
          where: {
            userId: userId,
          },
          fields: {
            secretKey: true,
          },
        });
      if (!userCreds) {
        throw new HttpErrors.Unauthorized(
          AuthenticateErrorKeys.UserDoesNotExist,
        );
      }
      return {
        isGenerated: Boolean(userCreds.secretKey),
      };
    } catch (error) {
      this.logger.error(error);
      if (error.name === 'TokenExpiredError') {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.CodeExpired);
      } else if (HttpErrors.HttpError.prototype.isPrototypeOf(error)) {
        throw error;
      } else {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
    }
  }

  @authorize({permissions: ['*']})
  @post('/auth/create-qr-code', {
    description: 'Generates a new qrCode for Authenticator App',
    responses: {
      [STATUS_CODE.OK]: {
        description:
          'qrCode that you can use to generate codes in Authenticator App',
        content: {
          [CONTENT_TYPE.JSON]: Object,
        },
      },
      ...ErrorCodes,
    },
  })
  async createQr(
    @requestBody() req: AuthTokenRequest,
    @inject(AuthCodeBindings.CODEREADER_PROVIDER)
    codeReader: CodeReaderFn,
  ): Promise<QrCodeCreateResponse> {
    const authClient = await this.authClientRepository.findOne({
      where: {
        clientId: req.clientId,
      },
    });
    if (!authClient) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    try {
      const code = await codeReader(req.code);
      const payload = (await this.jwtVerifier(code, {
        audience: req.clientId,
      })) as ClientAuthCode<User, typeof User.prototype.id>;

      const userId = payload.userId ?? payload.user?.id;

      const userCreds: Pick<UserCredentials, 'id'> | null =
        await this.userCredsRepository.findOne({
          where: {
            userId: userId,
          },
          fields: {
            id: true,
          },
        });

      if (!userCreds) {
        throw new HttpErrors.Unauthorized(
          AuthenticateErrorKeys.UserDoesNotExist,
        );
      }

      const secretKey = authenticator.generateSecret();
      await this.userCredsRepository.updateById(userCreds.id, {
        secretKey: secretKey,
      });

      const appName = process.env.APP_NAME ?? 'auth-service';
      let username = payload.user?.username;
      if (!username) {
        const user = await this.userRepo.findById(userId);
        username = user.username;
      }
      const otpauth = authenticator.keyuri(username, appName, secretKey);
      const qrCode = await qrcode.toDataURL(otpauth);
      return {
        qrCode,
      };
    } catch (error) {
      this.logger.error(error);
      if (error.name === 'TokenExpiredError') {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.CodeExpired);
      } else if (HttpErrors.HttpError.prototype.isPrototypeOf(error)) {
        throw error;
      } else {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
    }
  }
}
