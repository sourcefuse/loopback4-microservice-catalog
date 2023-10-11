import {repository} from '@loopback/repository';
import {LoginActivityRepository} from '../../repositories/sequelize';
import {LoginActivityController as JugglerLoginActivityController} from '../login-activity.controller';

export class LoginActivityController extends JugglerLoginActivityController {
  constructor(
    @repository(LoginActivityRepository)
    protected readonly loginActivityRepo: LoginActivityRepository,
  ) {
    super(loginActivityRepo);
  }
}
