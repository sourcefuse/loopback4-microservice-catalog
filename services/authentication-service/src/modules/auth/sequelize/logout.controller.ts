import { inject } from '@loopback/context';
import { repository } from '@loopback/repository';
import { Request, RequestContext, RestBindings } from '@loopback/rest';
import { ILogger, LOGGER } from '@sourceloop/core';
import { JwtPayloadFn } from '../../..';
import { AuthServiceBindings, AuthenticationBindings } from '../../../keys';
import { AuthClient } from '../../../models';
import { LoginActivityRepository, RefreshTokenRepository, RevokedTokenRepository, UserRepository, UserTenantRepository } from '../../../repositories/sequelize';
import { ActorId, IUserActivity } from '../../../types';
import { LogoutController as JugglerLogoutController } from '../logout.controller';
;
export class LogoutController  extends JugglerLogoutController{
  constructor(
    @inject(RestBindings.Http.REQUEST) protected readonly req: Request,
    @repository(RevokedTokenRepository)
    protected readonly revokedTokens: RevokedTokenRepository,
    @repository(RefreshTokenRepository)
    public refreshTokenRepo: RefreshTokenRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @repository(LoginActivityRepository)
    protected  readonly loginActivityRepo: LoginActivityRepository,
    @inject(AuthServiceBindings.ActorIdKey)
    protected  readonly actorKey: ActorId,
    @inject.context() protected readonly ctx: RequestContext,
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(UserTenantRepository)
    public userTenantRepo: UserTenantRepository,
    @inject(AuthServiceBindings.JWTPayloadProvider)
    protected  readonly getJwtPayload: JwtPayloadFn,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    protected  readonly client: AuthClient | undefined,
    @inject(AuthServiceBindings.MarkUserActivity, {optional: true})
    protected  readonly userActivity?: IUserActivity,
  ) {
    super(req,revokedTokens,refreshTokenRepo,logger,loginActivityRepo,actorKey,ctx,userRepo,userTenantRepo,getJwtPayload,client,userActivity
      )
  }
  }
 