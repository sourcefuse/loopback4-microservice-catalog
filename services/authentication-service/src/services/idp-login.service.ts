import {BindingScope, inject, injectable} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors, RequestContext} from '@loopback/rest';
import {AuthenticateErrorKeys, ILogger, LOGGER} from '@sourceloop/core';
import crypto from 'crypto';
import {
  authenticate,
  AuthErrorKeys,
  ClientAuthCode,
  STRATEGY,
} from 'loopback4-authentication';
import moment from 'moment';
import {LoginType} from '../enums';
import {AuthServiceBindings} from '../keys';
import {AuthClient, LoginActivity, User, UserTenant} from '../models';
import {
  AuthTokenRequest,
  AuthUser,
  IdpConfiguration,
  TokenResponse,
} from '../modules/auth';
import {
  AuthCodeBindings,
  CodeReaderFn,
  JwtPayloadFn,
  JWTSignerFn,
  JWTVerifierFn,
} from '../providers';
import {
  AuthClientRepository,
  LoginActivityRepository,
  RefreshTokenRepository,
  RevokedTokenRepository,
  UserRepository,
  UserTenantRepository,
} from '../repositories';
import {ActorId, ExternalTokens, IUserActivity} from '../types';

const clockSkew = 300;
const nonceTime = 3600;
const nonceCount = 10;

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
    @repository(RevokedTokenRepository)
    public revokedTokensRepo: RevokedTokenRepository,
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
  ) { }

  @authenticate(STRATEGY.COGNITO_OAUTH2, {
    callbackURL: process.env.COGNITO_AUTH_CALLBACK_URL,
    clientDomain: process.env.COGNITO_AUTH_CLIENT_DOMAIN,
    clientID: process.env.COGNITO_AUTH_CLIENT_ID,
    clientSecret: process.env.COGNITO_AUTH_CLIENT_SECRET,
    region: process.env.COGNITO_AUTH_REGION,
  })
  async loginViaCognito(): Promise<void> {
    // do nothing
  }

  @authenticate(STRATEGY.GOOGLE_OAUTH2, {
    accessType: 'offline',
    scope: ['profile', 'email'],
    authorizationURL: process.env.GOOGLE_AUTH_URL,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    tokenURL: process.env.GOOGLE_AUTH_TOKEN_URL,
  })
  async loginViaGoogle(): Promise<void> {
    // do nothing
  }

  @authenticate(STRATEGY.SAML, {
    accessType: 'offline',
    scope: ['profile', 'email'],
    callbackURL: process.env.SAML_CALLBACK_URL,
    issuer: process.env.SAML_ISSUER,
    cert: process.env.SAML_CERT,
    entryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.SAML_AUDIENCE,
    logoutUrl: process.env.SAML_LOGOUT_URL,
    passReqToCallback: !!+(process.env.SAML_AUTH_PASS_REQ_CALLBACK ?? 0),
    validateInResponseTo: !!+(process.env.VALIDATE_RESPONSE ?? 1),
    idpIssuer: process.env.IDP_ISSUER,
    logoutCallbackUrl: process.env.SAML_LOGOUT_CALLBACK_URL,
  })
  async loginViaSaml(): Promise<void> {
    // do nothing
  }

  @authenticate(STRATEGY.FACEBOOK_OAUTH2, {
    accessType: 'offline',
    authorizationURL: process.env.FACEBOOK_AUTH_URL,
    callbackURL: process.env.FACEBOOK_AUTH_CALLBACK_URL,
    clientID: process.env.FACEBOOK_AUTH_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_AUTH_CLIENT_SECRET,
    tokenURL: process.env.FACEBOOK_AUTH_TOKEN_URL,
  })
  async loginViaFacebook(): Promise<void> {
    // do nothing
  }

  @authenticate(STRATEGY.APPLE_OAUTH2, {
    accessType: 'offline',
    scope: ['name', 'email'],
    callbackURL: process.env.APPLE_AUTH_CALLBACK_URL,
    clientID: process.env.APPLE_AUTH_CLIENT_ID,
    teamID: process.env.APPLE_AUTH_TEAM_ID,
    keyID: process.env.APPLE_AUTH_KEY_ID,
    privateKeyLocation: process.env.APPLE_AUTH_PRIVATE_KEY_LOCATION,
  })
  async loginViaApple(): Promise<void> {
    // do nothing
  }

  @authenticate(STRATEGY.AZURE_AD, {
    scope: ['profile', 'email', 'openid', 'offline_access'],
    identityMetadata: process.env.AZURE_IDENTITY_METADATA,
    clientID: process.env.AZURE_AUTH_CLIENT_ID,
    responseType: 'code',
    responseMode: 'query',
    redirectUrl: process.env.AZURE_AUTH_REDIRECT_URL,
    clientSecret: process.env.AZURE_AUTH_CLIENT_SECRET,
    allowHttpForRedirectUrl: !!+(
      process.env.AZURE_AUTH_ALLOW_HTTP_REDIRECT ?? 1
    ),
    passReqToCallback: !!+(process.env.AZURE_AUTH_PASS_REQ_CALLBACK ?? 0),
    validateIssuer: !!+(process.env.AZURE_AUTH_VALIDATE_ISSUER ?? 1),
    useCookieInsteadOfSession: !!+(
      process.env.AZURE_AUTH_COOKIE_INSTEAD_SESSION ?? 1
    ),
    cookieEncryptionKeys: [
      {
        key: process.env.AZURE_AUTH_COOKIE_KEY,
        iv: process.env.AZURE_AUTH_COOKIE_IV,
      },
    ],
    isB2c: !!+(process.env.AZURE_AUTH_B2C_TENANT ?? 0),
    clockSkew: +(process.env.AZURE_AUTH_CLOCK_SKEW ?? clockSkew),
    loggingLevel: process.env.AZURE_AUTH_LOG_LEVEL,
    loggingNoPII: !!+(process.env.AZURE_AUTH_LOG_PII ?? 1),
    nonceLifetime: +(process.env.AZURE_AUTH_NONCE_TIME ?? nonceTime),
    nonceMaxAmount: +(process.env.AZURE_AUTH_NONCE_COUNT ?? nonceCount),
    issuer: process.env.AZURE_AUTH_ISSUER,
    cookieSameSite: !!+(process.env.AZURE_AUTH_COOKIE_SAME_SITE ?? 0),
  })
  async loginViaAzure(): Promise<void> {
    // do nothing
  }

  @authenticate(STRATEGY.INSTAGRAM_OAUTH2, {
    accessType: 'offline',
    authorizationURL: process.env.INSTAGRAM_AUTH_URL,
    callbackURL: process.env.INSTAGRAM_AUTH_CALLBACK_URL,
    clientID: process.env.INSTAGRAM_AUTH_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_AUTH_CLIENT_SECRET,
    tokenURL: process.env.INSTAGRAM_AUTH_TOKEN_URL,
  })
  async loginViaInstagram(): Promise<void> {
    // do nothing
  }

  @authenticate(STRATEGY.KEYCLOAK, {
    host: process.env.KEYCLOAK_HOST,
    realm: process.env.KEYCLOAK_REALM,
    clientID: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    callbackURL: process.env.KEYCLOAK_CALLBACK_URL,
    authorizationURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
    tokenURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    userInfoURL: `${process.env.KEYCLOAK_HOST}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
  })
  async loginViaKeycloak(): Promise<void> {
    // do nothing
  }

  /**
   * The function `getOpenIdConfiguration` returns an IdpConfiguration object with specific properties
   * set based on environment variables.
   * @returns An IdpConfiguration object with the specified properties and values is being returned.
   */
  getOpenIdConfiguration() {
    const config = new IdpConfiguration();
    config.issuer = '';
    config.authorization_endpoint = `${process.env.API_BASE_URL}/connect/auth`;
    config.token_endpoint = `${process.env.API_BASE_URL}/connect/token`;
    config.jwks_uri = '';
    config.end_session_endpoint = `${process.env.API_BASE_URL}/connect/endsession`;
    config.response_types_supported = ['code'];
    config.scopes_supported = ['openid', 'email', 'phone', 'profile'];
    config.id_token_signing_alg_values_supported = ['RS256'];
    config.token_endpoint_auth_methods_supported = [
      'client_secret_basic',
      'client_secret_post',
    ];
    config.userinfo_endpoint = `${process.env.API_BASE_URL}/connect/userinfo`;
    return config;
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
  private async createJWT(
    payload: ClientAuthCode<User, typeof User.prototype.id> & ExternalTokens,
    authClient: AuthClient,
    loginType: LoginType,
    tenantId?: string,
  ): Promise<TokenResponse> {
    try {
      const size = 32;
      const ms = 1000;
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
        // Do nothing and move ahead
      }
      if (!user) {
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
        this.markUserActivity(user, userTenant, {...data}, loginType);

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
  public markUserActivity(
    user: User,
    userTenant: UserTenant | null,
    payload: AnyObject,
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
      const activityPayload = JSON.stringify(payload);
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
      let actor: string;
      let tenantId: string;
      if (userTenant) {
        actor = userTenant[this.actorKey]?.toString() ?? '0';
        tenantId = userTenant.tenantId;
      } else {
        actor = user['id']?.toString() ?? '0';
        tenantId = user.defaultTenantId;
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
}
