import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {RequestContext} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  AuthClientRepository,
  LoginActivityRepository,
  OtpCacheRepository,
  RefreshTokenRepository,
  RevokedTokenRepository,
  RoleRepository,
  TenantConfigRepository,
  UserCredentialsRepository,
  UserLevelPermissionRepository,
  UserLevelResourceRepository,
  UserRepository,
  UserTenantRepository,
} from '../../../repositories/sequelize';
import {LoginController as JugglerLoginController} from '../login.controller';

import {AuthServiceBindings} from '../../../keys';
import {AuthClient} from '../../../models';
import {
  AuthCodeBindings,
  AuthCodeGeneratorFn,
  JWTSignerFn,
  JwtPayloadFn,
} from '../../../providers';
import {LoginHelperService} from '../../../services';
import {ActorId, IUserActivity} from '../../../types';
import {AuthUser} from '../models/auth-user.model';
export class LoginController extends JugglerLoginController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    protected readonly client: AuthClient | undefined,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected readonly user: AuthUser | undefined,
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(OtpCacheRepository)
    public otpCacheRepo: OtpCacheRepository,
    @repository(RoleRepository)
    public roleRepo: RoleRepository,
    @repository(UserLevelPermissionRepository)
    public utPermsRepo: UserLevelPermissionRepository,
    @repository(UserLevelResourceRepository)
    public userResourcesRepository: UserLevelResourceRepository,
    @repository(UserTenantRepository)
    public userTenantRepo: UserTenantRepository,
    @repository(RefreshTokenRepository)
    public refreshTokenRepo: RefreshTokenRepository,
    @repository(RevokedTokenRepository)
    public revokedTokensRepo: RevokedTokenRepository,
    @repository(TenantConfigRepository)
    public tenantConfigRepo: TenantConfigRepository,
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthServiceBindings.JWTPayloadProvider)
    protected readonly getJwtPayload: JwtPayloadFn,
    @inject('services.LoginHelperService')
    protected readonly loginHelperService: LoginHelperService,
    @inject(AuthCodeBindings.AUTH_CODE_GENERATOR_PROVIDER)
    protected readonly getAuthCode: AuthCodeGeneratorFn,
    @inject(AuthCodeBindings.JWT_SIGNER)
    protected readonly jwtSigner: JWTSignerFn<object>,
    @repository(LoginActivityRepository)
    protected readonly loginActivityRepo: LoginActivityRepository,
    @inject(AuthServiceBindings.ActorIdKey)
    protected readonly actorKey: ActorId,
    @inject.context() protected readonly ctx: RequestContext,
    @inject(AuthServiceBindings.MarkUserActivity, {optional: true})
    protected readonly userActivity?: IUserActivity,
  ) {
    super(
      client,
      user,
      authClientRepository,
      userRepo,
      otpCacheRepo,
      roleRepo,
      utPermsRepo,
      userResourcesRepository,
      userTenantRepo,
      refreshTokenRepo,
      revokedTokensRepo,
      tenantConfigRepo,
      userCredsRepository,
      logger,
      getJwtPayload,
      loginHelperService,
      getAuthCode,
      jwtSigner,
      loginActivityRepo,
      actorKey,
      ctx,
      userActivity,
    );
  }
}
