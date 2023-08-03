import {injectable, BindingScope, inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {LOGGER, ILogger} from '@sourceloop/core';
import {sign} from 'jsonwebtoken';
import moment from 'moment';
import {SurveyResponder} from '../models';
import {SurveyCycleRepository, SurveyRepository} from '../repositories';
import {PermissionKey} from '../enum';
import {
  SurveyCycleRepository as SurveyCycleSequelizeRepo,
  SurveyRepository as SurveySequelizeRepo,
} from '../repositories/sequelize';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyResponderService {
  constructor(
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @repository(SurveyCycleRepository)
    protected surveyCycleRepository:
      | SurveyCycleRepository
      | SurveyCycleSequelizeRepo,
    @repository(SurveyRepository)
    protected surveyRepository: SurveyRepository | SurveySequelizeRepo,
  ) {}

  async getAccessToken(surveyResponders: SurveyResponder[], surveyId: string) {
    try {
      const surveyCycle = await this.surveyCycleRepository.findById(
        surveyResponders[0].surveyCycleId,
      );
      const emails: string[] = [];
      surveyResponders?.forEach(responder => {
        if (responder.email) {
          emails.push(responder.email);
        }
      });
      const tokens: string[] = [];
      const permissions = [
        PermissionKey.ViewOpenSurvey,
        PermissionKey.ViewOpenSurveyQuestion,
        PermissionKey.ViewOpenSurveySection,
        PermissionKey.ViewOpenSurveyResponse,
        PermissionKey.CreateOpenSurveyResponse,
      ];
      emails?.forEach(email => {
        const user = {
          email,
          surveyId: surveyId,
          surveyCycleId: surveyCycle.id,
          permissions,
        };

        const accessToken = sign(user, process.env.JWT_SECRET as string, {
          expiresIn: this._getExpiresInSeconds(surveyCycle.endDate),
          issuer: process.env.JWT_ISSUER,
          algorithm: 'HS256',
        });

        tokens.push(accessToken);
      });

      return {
        tokens,
      };
    } catch (err) {
      this.logger.error(err);
    }
  }

  private _getExpiresInSeconds(endDate: string) {
    const endDateString = moment(endDate).format('YYYY-MM-DD');
    const end = new Date(`${endDateString} 23:59:59`);
    const thousand = 1000;
    return Math.floor((end.getTime() - new Date().getTime()) / thousand);
  }
}
