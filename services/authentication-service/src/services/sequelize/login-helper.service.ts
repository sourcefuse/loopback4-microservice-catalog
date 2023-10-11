import { inject } from '@loopback/context';
import { repository } from '@loopback/repository';
import { ILogger, LOGGER } from '@sourceloop/core';
import { UserTenantRepository } from '../../repositories/sequelize';
import { LoginHelperService as JugglerLoginHelperService } from '../login-helper.service';
export class LoginHelperService extends JugglerLoginHelperService {
  constructor(
    @repository(UserTenantRepository)
    protected readonly userTenantRepo: UserTenantRepository,
    @inject(LOGGER.LOGGER_INJECT) protected readonly logger: ILogger,
  ) {
    super(userTenantRepo,logger)
  }
  }