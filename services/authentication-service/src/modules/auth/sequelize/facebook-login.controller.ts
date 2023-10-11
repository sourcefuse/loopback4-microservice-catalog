import { inject } from "@loopback/context";
import { repository } from "@loopback/repository";
import { ILogger, LOGGER } from "@sourceloop/core";
import { AuthCodeBindings, AuthCodeGeneratorFn } from "../../..";
import { AuthClientRepository } from "../../../repositories/sequelize";
import { FacebookLoginController as JugglerFacebookLoginController } from '../facebook-login.controller';
export class FacebookLoginController extends JugglerFacebookLoginController  {
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