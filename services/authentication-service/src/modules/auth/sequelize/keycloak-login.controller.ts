import { inject } from "@loopback/context";
import { repository } from "@loopback/repository";
import { ILogger, LOGGER } from "@sourceloop/core";
import { AuthCodeBindings, AuthCodeGeneratorFn } from "../../../providers";
import { AuthClientRepository } from "../../../repositories/sequelize";
import { KeycloakLoginController as JugglerKeycloakLoginController } from '../keycloak-login.controller';
export class KeycloakLoginController extends JugglerKeycloakLoginController  {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthCodeBindings.AUTH_CODE_GENERATOR_PROVIDER)
    protected readonly getAuthCode: AuthCodeGeneratorFn,
  ) {
    super(authClientRepository,logger,getAuthCode)
  }
  }