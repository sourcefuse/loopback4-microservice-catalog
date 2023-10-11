import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  RevokedTokenRepository,
  UserRepository,
} from '../../repositories/sequelize';
import {LoginHelperService} from '../../services';
import {ForgetPasswordController as JugglerForgetPasswordController} from '../forget-password.controller';
export class ForgetPasswordController extends JugglerForgetPasswordController {
  constructor(
    @repository(UserRepository)
    protected readonly userRepo: UserRepository,
    @repository(RevokedTokenRepository)
    protected readonly revokedTokensRepo: RevokedTokenRepository,
    @inject('services.LoginHelperService')
    protected readonly loginHelperService: LoginHelperService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    super(userRepo, revokedTokensRepo, loginHelperService, logger);
  }
}
