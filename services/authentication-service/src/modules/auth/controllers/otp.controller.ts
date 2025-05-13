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
    const isMfaEnabled = await this.checkMfa(user);
  
    if (!isMfaEnabled) {
      throw new HttpErrors.BadRequest('MFA is not enabled for this user.');
    }
  
    const {clientId, userId, clientSecret} = await this._getOtpVerificationDetails(
      req,
      user,
    );
  
    const codePayload: ClientAuthCode<User, typeof User.prototype.id> = {
      clientId,
      userId,
    };
  
    const token = await codeWriter(
      jwt.sign(codePayload, clientSecret, {
        expiresIn: 180,
        audience: clientId,
        issuer: process.env.JWT_ISSUER,
        algorithm: 'HS256',
      }),
    );
  
    return {code: token};
  }
  
  /**
   * The function `_getOtpVerificationDetails` determines the OTP verification method based on the MFA
   * configuration and handles either OTP or Google Authenticator methods.
   * @param {OtpLoginRequest} req - The `req` parameter in the `_getOtpVerificationDetails` function is
   * of type `OtpLoginRequest`, which likely contains information related to the OTP login request
   * being processed.
   * @param {AuthUser} user - The `user` parameter in the `_getOtpVerificationDetails` method
   * represents the authenticated user for whom the OTP verification details are being retrieved. This
   * user object likely contains information such as the user's ID, username, email, and other relevant
   * details needed for the OTP verification process.
   * @returns The `_getOtpVerificationDetails` method returns an object with the properties `clientId`,
   * `userId`, and `clientSecret` as a Promise.
   */
  private async _getOtpVerificationDetails(
    req: OtpLoginRequest,
    user: AuthUser,
  ): Promise<{clientId: string; userId: string; clientSecret: jwt.Secret}> {
    const isOtpStrategy = this.mfaConfig.secondFactor === STRATEGY.OTP;
  
    if (isOtpStrategy && this.otpConfig.method === OtpMethodType.OTP) {
      return this._handleOtpMethod(req, user);
    } else if (
      isOtpStrategy &&
      this.otpConfig.method === OtpMethodType.GOOGLE_AUTHENTICATOR
    ) {
      return this._handleGoogleAuthenticatorMethod(req, user);
    } else {
      throw new HttpErrors.BadRequest('Unsupported MFA configuration.');
    }
  }
  
  /**
   * The function `_handleOtpMethod` retrieves and validates OTP cache data for a given request and
   * user, returning the client ID, user ID, and client secret.
   * @param {OtpLoginRequest} req - The `req` parameter in the `_handleOtpMethod` function is of type
   * `OtpLoginRequest`, which likely contains information required for OTP (One-Time Password) login
   * process, such as the OTP key.
   * @param {AuthUser} user - The `user` parameter in the `_handleOtpMethod` function represents the
   * authenticated user who is attempting to log in using OTP (One-Time Password). This user object
   * contains information about the user, such as their ID, which is used to associate the OTP login
   * request with the correct user account.
   * @returns The `_handleOtpMethod` function returns an object with the properties `clientId`,
   * `userId`, and `clientSecret`. The values for these properties are retrieved from the `otpCache`
   * object.
   */
  private async _handleOtpMethod(
    req: OtpLoginRequest,
    user: AuthUser,
  ): Promise<{clientId: string; userId: string; clientSecret: jwt.Secret}> {
    const otpCache = await this.otpCacheRepo.get(req.key);
  
    if (!otpCache) {
      throw new HttpErrors.NotFound('OTP cache not found.');
    }
  
    if (!otpCache.clientId || !otpCache.clientSecret) {
      throw new HttpErrors.UnprocessableEntity(
        'Client info is incomplete in OTP cache.',
      );
    }
  
    otpCache.userId = user?.id ?? otpCache.userId;
  
    if (!otpCache.userId) {
      throw new HttpErrors.UnprocessableEntity('User ID missing in OTP cache.');
    }
  
    return {
      clientId: otpCache.clientId,
      userId: otpCache.userId,
      clientSecret: otpCache.clientSecret,
    };
  }
  
  /**
   * The function `_handleGoogleAuthenticatorMethod` validates and retrieves necessary data for Google
   * Authenticator authentication.
   * @param {OtpLoginRequest} req - The `req` parameter in the `_handleGoogleAuthenticatorMethod`
   * function is of type `OtpLoginRequest`. It likely contains information related to the OTP (One-Time
   * Password) login request, such as the client ID.
   * @param {AuthUser} user - The `user` parameter in the `_handleGoogleAuthenticatorMethod` function
   * represents the authenticated user who is trying to log in using Google Authenticator. It contains
   * information about the user, such as their ID and other relevant details needed for the
   * authentication process.
   * @returns The function `_handleGoogleAuthenticatorMethod` is returning an object with the
   * properties `clientId`, `userId`, and `clientSecret`. The values for these properties are taken
   * from the `req.clientId`, `user.id`, and `client.clientSecret` respectively.
   */
  private async _handleGoogleAuthenticatorMethod(
    req: OtpLoginRequest,
    user: AuthUser,
  ): Promise<{clientId: string; userId: string; clientSecret: jwt.Secret}> {
    if (!req.clientId) {
      throw new HttpErrors.BadRequest(
        'Client ID must be provided for Google Authenticator.',
      );
    }
  
    const client = await this.authClientRepository.findOne({
      where: {clientId: req.clientId},
    });
  
    if (!client?.clientSecret) {
      throw new HttpErrors.NotFound('Auth client not found or secret missing.');
    }
    if (!user.id) {
      throw new HttpErrors.UnprocessableEntity('User ID is missing.');
    }
  
    return {
      clientId: req.clientId,
      userId: user.id,
      clientSecret: client.clientSecret,
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
