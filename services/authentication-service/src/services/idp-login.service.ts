import {BindingScope, inject, injectable} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors, RequestContext} from '@loopback/rest';
import {
  AuthenticateErrorKeys,
  ILogger,
  JwtKeysRepository,
  LOGGER,
  PublicKeysRepository,
  SuccessResponse,
} from '@sourceloop/core';
import crypto, {generateKeyPairSync} from 'crypto';
import * as jwt from 'jsonwebtoken';
import {AuthErrorKeys, ClientAuthCode} from 'loopback4-authentication';
import moment from 'moment';
import * as jose from 'node-jose';
import {LoginType} from '../enums';
import {AuthServiceBindings} from '../keys';
import {
  AuthClient,
  LoginActivity,
  RefreshToken,
  RefreshTokenRequest,
  User,
  UserTenant,
} from '../models';
import {
  AuthTokenRequest,
  AuthUser,
  IdpConfiguration,
  TokenResponse,
} from '../modules/auth';
import {TokenPayload} from '../modules/auth/interfaces';
import {
  CodeReaderFn,
  JwtPayloadFn,
  JWTSignerFn,
  JWTVerifierFn,
} from '../providers';
import {AuthCodeBindings} from '../providers/keys';
import {
  AuthClientRepository,
  LoginActivityRepository,
  RefreshTokenRepository,
  RevokedTokenRepository,
  UserRepository,
  UserTenantRepository,
} from '../repositories';
import {ActorId, ExternalTokens, IUserActivity} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class IdpLoginService {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(UserTenantRepository)
    public userTenantRepo: UserTenantRepository,
    @repository(RefreshTokenRepository)
    public refreshTokenRepo: RefreshTokenRepository,
    @repository(PublicKeysRepository)
    public publicKeyRepo: PublicKeysRepository,
    @repository(JwtKeysRepository)
    public jwtKeysRepo: JwtKeysRepository,
    @repository(RevokedTokenRepository)
    private readonly revokedTokensRepo: RevokedTokenRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @repository(LoginActivityRepository)
    private readonly loginActivityRepo: LoginActivityRepository,
    @inject(AuthServiceBindings.ActorIdKey)
    private readonly actorKey: ActorId,
    @inject.context() private readonly ctx: RequestContext,
    @inject(AuthCodeBindings.CODEREADER_PROVIDER)
    private readonly codeReader: CodeReaderFn,
    @inject(AuthCodeBindings.JWT_VERIFIER, {optional: true})
    private readonly jwtVerifier: JWTVerifierFn<AnyObject>,
    @inject(AuthCodeBindings.JWT_SIGNER)
    private readonly jwtSigner: JWTSignerFn<object>,
    @inject(AuthServiceBindings.JWTPayloadProvider)
    private readonly getJwtPayload: JwtPayloadFn,
    @inject(AuthServiceBindings.MarkUserActivity, {optional: true})
    private readonly userActivity?: IUserActivity,
  ) {}

  /**
   * The function `getOpenIdConfiguration` returns an IdpConfiguration object with specific properties
   * set based on environment variables.
   * @returns An IdpConfiguration object with the specified properties and values is being returned.
   */
  async getOpenIdConfiguration() {
    // sonarignore:start
    const config = new IdpConfiguration();
    config.issuer = `${process.env.API_BASE_URL}`;
    config.authorization_endpoint = `${process.env.API_BASE_URL}/connect/auth`;
    config.token_endpoint = `${process.env.API_BASE_URL}/connect/token`;
    config.jwks_uri = `${process.env.API_BASE_URL}/connect/get-keys`;
    config.end_session_endpoint = `${process.env.API_BASE_URL}/connect/endsession`;
    config.response_types_supported = ['code', 'id_token', 'token'];
    config.scopes_supported = ['openid', 'email', 'phone', 'profile'];
    config.id_token_signing_alg_values_supported = [
      'RS256',
      'HS256',
      'RS384',
      'RS512',
    ];
    config.token_endpoint_auth_methods_supported = [
      'client_secret_basic',
      'client_secret_post',
    ];
    config.userinfo_endpoint = `${process.env.API_BASE_URL}/connect/userinfo`;
    return config;
    // sonarignore:end
  }

  /**
   * The function `generateToken` generates a JWT token for a client using a code
   * and performs various authentication checks.
   * @param {string} clientId - The `clientId` parameter in the `generateToken`
   * function is a string that represents the client ID associated with the
   * authentication request. It is used to identify the client making the request
   * for generating a token.
   * @param {string} code - The `code` parameter in the `generateToken` function is
   * a string that represents the authorization code that will be used to generate
   * a token for authentication and authorization purposes. This code is typically
   * obtained during the authorization code flow in OAuth 2.0 when a user grants
   * permission to a client application.
   * @param {CodeReaderFn} codeReader - The `codeReader` parameter in the
   * `generateToken` function is a function that reads a code and returns a result.
   * It is injected using `@inject(AuthCodeBindings.CODEREADER_PROVIDER)` which
   * means it is provided by a binding defined in the `AuthCodeBindings` namespace.
   * The
   * @returns The `generateToken` function is returning the result of calling
   * `this.createJWT(payload, authClient, LoginType.ACCESS)` after performing
   * various checks and operations.
   */
  public async generateToken(
    request: AuthTokenRequest,
  ): Promise<TokenResponse> {
    const authClient = await this.authClientRepository.findOne({
      where: {
        clientId: request.clientId,
      },
    });
    if (!authClient) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }
    try {
      const resultCode = await this.codeReader(request.code);
      const payload = (await this.jwtVerifier(resultCode, {
        audience: request.clientId,
      })) as ClientAuthCode<User, typeof User.prototype.id>;
      if (payload.mfa) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.UserVerificationFailed);
      }

      if (
        payload.userId &&
        !(await this.userRepo.firstTimeUser(payload.userId))
      ) {
        await this.userRepo.updateLastLogin(payload.userId);
      }

      return await this.createJWT(payload, authClient, LoginType.ACCESS);
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

  /**
   * The `createJWT` function generates a JWT token for a user with specified
   * payload and authentication client, handling user authentication and token
   * expiration.
   * @param payload - The `payload` parameter in the `createJWT` function is an
   * object that contains information about the user and external tokens. It has
   * the following properties:
   * @param {AuthClient} authClient - The `authClient` parameter in the `createJWT`
   * function represents the client that is requesting the JWT token generation. It
   * contains information about the client, such as the client ID, access token
   * expiration time, and refresh token expiration time. This information is used
   * to customize the JWT token generation process based
   * @param {LoginType} loginType - The `loginType` parameter in the `createJWT`
   * function represents the type of login being performed, such as regular login,
   * social login, or any other specific type of authentication method. It helps in
   * determining the context of the login operation and can be used to customize
   * the behavior or processing logic based
   * @param {string} [tenantId] - The `tenantId` parameter in the `createJWT`
   * function is an optional parameter of type string. It is used to specify the ID
   * of the tenant for which the JWT token is being created. If provided, it is
   * used in the process of generating the JWT payload. If not provided, the
   * @returns A `TokenResponse` object is being returned, which contains the
   * `accessToken`, `refreshToken`, and `expires` properties.
   */
  /**
   * The function `createJWT` generates a JWT token for a user with specified payload and
   * authentication client, handling token expiration and refresh token storage.
   * @param payload - The `payload` parameter in the `createJWT` function is an object that contains
   * information about the user and external tokens. It has the following properties:
   * @param {AuthClient} authClient - The `authClient` parameter in the `createJWT` function represents
   * the client that is requesting the JWT (JSON Web Token) creation. It contains information about the
   * client, such as the client ID and the expiration time for the access token. This information is
   * used to customize the JWT payload and set
   * @param {LoginType} loginType - The `loginType` parameter in the `createJWT` function represents
   * the type of login being performed, such as "email", "social", "phone", etc. It helps in
   * determining the context of the authentication process and can be used for logging, analytics, or
   * custom logic based on the login
   * @param {string} [tenantId] - The `tenantId` parameter in the `createJWT` function is an optional
   * parameter that represents the ID of a specific tenant. Tenants are typically used in multi-tenant
   * applications to isolate data and configuration for different groups of users or organizations. If
   * provided, the `tenantId` is used to
   * @returns The `createJWT` function returns a `TokenResponse` object containing the access token,
   * refresh token, and expiration time.
   */
  private async createJWT(
    payload: ClientAuthCode<User, typeof User.prototype.id> & ExternalTokens,
    authClient: AuthClient,
    loginType: LoginType,
    tenantId?: string,
  ): Promise<TokenResponse> {
    const size = 32;
    const ms = 1000;
    try {
      let user: User | undefined;
      if (payload.user) {
        user = payload.user;
      } else if (payload.userId) {
        user = await this.userRepo.findById(payload.userId, {
          include: [
            {
              relation: 'defaultTenant',
            },
          ],
        });
        if (payload.externalAuthToken && payload.externalRefreshToken) {
          (user as AuthUser).externalAuthToken = payload.externalAuthToken;
          (user as AuthUser).externalRefreshToken =
            payload.externalRefreshToken;
        }
      } else {
        throw new HttpErrors.Unauthorized(
          AuthenticateErrorKeys.UserDoesNotExist,
        );
      }
      const data: AnyObject = await this.getJwtPayload(
        user,
        authClient,
        tenantId,
      );
      const accessToken = await this.jwtSigner(data, {
        expiresIn: authClient.accessTokenExpiration,
      });
      const refreshToken: string = crypto.randomBytes(size).toString('hex');
      // Set refresh token into redis for later verification
      await this.refreshTokenRepo.set(
        refreshToken,
        {
          clientId: authClient.clientId,
          userId: user.id,
          username: user.username,
          accessToken,
          externalAuthToken: (user as AuthUser).externalAuthToken,
          externalRefreshToken: (user as AuthUser).externalRefreshToken,
          tenantId: data.tenantId,
        },
        {ttl: authClient.refreshTokenExpiration * ms},
      );

      const userTenant = await this.userTenantRepo.findOne({
        where: {userId: user.id},
      });
      if (this.userActivity?.markUserActivity)
        this.markUserActivity({...data}, user, userTenant, loginType);

      return new TokenResponse({
        accessToken,
        refreshToken,
        expires: moment()
          .add(authClient.accessTokenExpiration, 's')
          .toDate()
          .getTime(),
      });
    } catch (error) {
      this.logger.error(error);
      if (HttpErrors.HttpError.prototype.isPrototypeOf(error)) {
        throw error;
      } else {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
    }
  }

  /**
   * The function `markUserActivity` encrypts and stores user login activity,
   * including IP address and payload, in a database.
   * @param {User} user - The `user` parameter in the `markUserActivity` function
   * represents the user who is performing the activity for which you are marking the
   * login activity. This user object likely contains information about the user,
   * such as their ID, name, email, etc. It is used to identify the actor of the
   * @param {UserTenant | null} userTenant - The `userTenant` parameter in the
   * `markUserActivity` function represents the tenant associated with the user. It
   * can be either an object of type `UserTenant` or `null` if there is no specific
   * tenant assigned to the user. The function uses this parameter to determine the
   * actor and tenant
   * @param {AnyObject} payload - The `payload` parameter in the `markUserActivity`
   * function is the data that you want to encrypt and store as part of the user's
   * login activity. In the provided code snippet, the `payload` is first converted
   * to a JSON string using `JSON.stringify(payload)`. Then, it is
   * @param {LoginType} loginType - The `loginType` parameter in the
   * `markUserActivity` function represents the type of login activity being
   * performed by the user. It is used to specify whether the user is logging in
   * using a certain method or platform. Examples of `loginType` could include
   * 'email', 'social', '2
   */
  private markUserActivity(
    payload: RefreshToken | AnyObject,
    user: User,
    userTenant: UserTenant | null,
    loginType: LoginType,
  ) {
    const size = 16;
    const encryptionKey = process.env.ENCRYPTION_KEY;

    if (encryptionKey) {
      const iv = crypto.randomBytes(size);

      /* encryption of IP Address */
      const cipherIp = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
      const ip =
        this.ctx.request.headers['x-forwarded-for']?.toString() ??
        this.ctx.request.socket.remoteAddress?.toString() ??
        '';
      const encyptIp = Buffer.concat([
        cipherIp.update(ip, 'utf8'),
        cipherIp.final(),
      ]);
      const authTagIp = cipherIp.getAuthTag();
      const ipAddress = JSON.stringify({
        iv: iv.toString('hex'),
        encryptedData: encyptIp.toString('hex'),
        authTag: authTagIp.toString('hex'),
      });

      /* encryption of Paylolad Address */
      const cipherPayload = crypto.createCipheriv(
        'aes-256-gcm',
        encryptionKey,
        iv,
      );
      let activityPayload;
      if (loginType === LoginType.LOGOUT) {
        activityPayload = JSON.stringify({
          ...user,
          clientId: payload.clientId,
        });
      } else {
        activityPayload = JSON.stringify(payload);
      }
      const encyptPayload = Buffer.concat([
        cipherPayload.update(activityPayload, 'utf8'),
        cipherPayload.final(),
      ]);
      const authTagPayload = cipherIp.getAuthTag();
      const tokenPayload = JSON.stringify({
        iv: iv.toString('hex'),
        encryptedData: encyptPayload.toString('hex'),
        authTag: authTagPayload.toString('hex'),
      });
      // make an entry to mark the users login activity
      let actor, tenantId: string;
      if (userTenant) {
        actor = userTenant[this.actorKey]?.toString() ?? '0';
        tenantId = userTenant.tenantId;
      } else {
        actor = user['id']?.toString() ?? '0';
        tenantId = user.defaultTenantId ?? '0';
      }
      const loginActivity = new LoginActivity({
        actor,
        tenantId,
        loginTime: new Date(),
        tokenPayload,
        loginType,
        deviceInfo: this.ctx.request.headers['user-agent']?.toString(),
        ipAddress,
      });
      this.loginActivityRepo.create(loginActivity).catch(() => {
        this.logger.error(
          `Failed to add the login activity => ${JSON.stringify(
            loginActivity,
          )}`,
        );
      });
    }
  }

  /**
   * The `logoutUser` function in TypeScript handles the logout process for a user
   * by revoking tokens and deleting refresh tokens.
   * @param {string} auth - The `auth` parameter in the `logoutUser` function is a
   * string that represents the authentication token. It is used to identify and
   * authenticate the user who is attempting to log out. The function extracts the
   * token from the `auth` parameter and performs various checks and operations
   * related to user logout based on
   * @param {RefreshTokenRequest} req - The `req` parameter in the `logoutUser`
   * function is of type `RefreshTokenRequest`. It likely contains information
   * related to the refresh token that is used to identify and authenticate the
   * user during the logout process. This parameter may include properties such as
   * `refreshToken`, which is essential for revoking
   * @returns The `logoutUser` function returns a `Promise` that resolves to a
   * `SuccessResponse` object with a `success` property set to `true` and a `key`
   * property set to `refreshTokenModel.userId`.
   */
  async logoutUser(
    auth: string,
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
    const expiry = this.decodeAndGetExpiry(token);
    await this.revokedTokensRepo.set(
      token,
      {token},
      {
        ttl: expiry,
      },
    );
    await this.revokedTokensRepo.set(token, {token});
    await this.refreshTokenRepo.delete(req.refreshToken);
    if (refreshTokenModel.pubnubToken) {
      await this.refreshTokenRepo.delete(refreshTokenModel.pubnubToken);
    }

    const user = await this.userRepo.findById(refreshTokenModel.userId);

    const userTenant = await this.userTenantRepo.findOne({
      where: {userId: user.id},
    });

    if (this.userActivity?.markUserActivity)
      this.markUserActivity(
        refreshTokenModel,
        user,
        userTenant,
        LoginType.LOGOUT,
      );
    return new SuccessResponse({
      success: true,
      key: refreshTokenModel.userId,
    });
  }

  /**
   * The `generateKeys` function generates new keys for a specified number of times defined by the
   * `MAX_JWT_KEYS` environment variable or 2 by default.
   */
  async generateKeys(): Promise<void> {
    //call the function to generate new keys for process.env.MAX_JWT_KEYS times.
    for (let i = 0; i < +(process.env.MAX_JWT_KEYS ?? 2); i++) {
      await this.generateNewKey();
    }
  }

  /**
   * The function generates a JSON Web Key Set (JWKS) containing a RSA public key and saves it to a
   * file.
   */
  async generateNewKey(): Promise<void> {
    // Generate the RSA key pair
    const {publicKey, privateKey} = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE,
      },
    });

    // Create the JWKS object
    const keyStore = jose.JWK.createKeyStore();
    const key = await keyStore.add(publicKey, 'pem');

    // Fetch existing keys from the database
    const existingKeys = await this.jwtKeysRepo.find({
      order: ['createdOn ASC'],
    });

    // Rotate keys: remove the oldest key if max limit is exceeded
    const maxKeys = +(process.env.MAX_JWT_KEYS ?? 2);
    if (existingKeys.length >= maxKeys) {
      const oldestKey = existingKeys[0];
      // Remove the oldest key from the cache and database
      await this.publicKeyRepo.delete(oldestKey.keyId);
      await this.jwtKeysRepo.deleteById(oldestKey.id);
    }

    // Save the public key to the cache for retrieval on facade
    await this.publicKeyRepo.set(key.kid, {
      keyId: key.kid,
      publicKey,
    });

    // Save public and private keys to the database using JwtKeysRepository
    await this.jwtKeysRepo.create({
      keyId: key.kid, // Unique identifier for the key
      publicKey: publicKey,
      privateKey: privateKey,
    });
  }

  /**
   * The function decodes a JWT token and returns the expiration time in milliseconds.
   * @param {string} token - The `token` parameter is a string that represents a JSON Web Token (JWT).
   * @returns the expiry time of the token in milliseconds.
   */
  /**
   * Decodes the given token and retrieves the expiry timestamp.
   *
   * @param token - The token to decode.
   * @returns The expiry timestamp in milliseconds.
   */
  decodeAndGetExpiry(token: string): number | null {
    const tokenData = jwt.decode(token) as TokenPayload | null; // handle null result from decode
    const ms = 1000;

    if (tokenData?.exp) {
      return tokenData.exp * ms;
    }

    // If tokenData or exp is missing, return null to indicate no expiry
    return null;
  }
}
