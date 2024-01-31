import {BindingScope, inject, injectable} from '@loopback/context';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {sign} from 'jsonwebtoken';
import moment from 'moment';
import {PermissionKey} from '../enum';
import {SurveyResponder} from '../models';
import {
  SurveyCycleRepository,
  SurveyRepository,
  SurveyResponderRepository,
} from '../repositories';
import {SurveyCycleService} from './survey-cycle.service';
import {SurveyService} from './survey.service';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyResponderService {
  constructor(
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @repository(SurveyResponderRepository)
    protected surveyResponderRepository: SurveyResponderRepository,
    @repository(SurveyCycleRepository)
    protected surveyCycleRepository: SurveyCycleRepository,
    @repository(SurveyRepository)
    protected surveyRepository: SurveyRepository,
    @service(SurveyService)
    public surveyService: SurveyService,
    @service(SurveyCycleService)
    public surveyCycleService: SurveyCycleService,
  ) {}

  async createSurveyResponder(
    surveyId: string,
    surveyResponder: Omit<SurveyResponder, 'id'>,
  ) {
    await this.surveyService.checkIfAllowedToUpdateSurvey(surveyId);

    if (surveyResponder.surveyCycleId) {
      await this.surveyCycleService.validateSurveyCycle(
        surveyResponder.surveyCycleId,
        surveyId,
      );
    }
    surveyResponder.surveyId = surveyId;
    surveyResponder.firstName =
      surveyResponder.firstName ??
      surveyResponder.email?.substring(0, surveyResponder.email.indexOf('@'));
    const resp = await this.surveyRepository
      .surveyResponders(surveyId)
      .create(surveyResponder);

    // fetch createdSurveyCycle with id
    const createdSurveyResponder = await this.surveyResponderRepository.findOne(
      {
        where: {surveyId},
        order: ['created_on DESC'],
      },
    );

    if (createdSurveyResponder) {
      if (createdSurveyResponder.surveyCycleId) {
        this.surveyCycleService
          .checkIfResponderAddedInActiveCycle(createdSurveyResponder)
          .catch(error => {
            throw new Error(error);
          });
      }
    }

    return resp;
  }

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
