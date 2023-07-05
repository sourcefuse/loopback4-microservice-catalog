import {
  injectable,
  /* inject, */
  BindingScope,
  inject,
} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';

import {repository, Where} from '@loopback/repository';
import {ResponderReminderDto} from '../models/responder-reminder-dto.model';
import {ErrorKeys} from '../enum/error-keys.enum';
import moment from 'moment';
import {QuestionType} from '../enum/question.enum';
import {
  SurveyResponseDto,
  SurveyResponse,
  Question,
  SurveyCycle,
  SurveyResponseDetailDto,
  SurveyResponder,
} from '../models';
import {SurveyResponseDetail} from '../models/survey-response-detail.model';
import {HttpErrors} from '@loopback/rest';
import {SurveyCycleRepository} from '../repositories/survey-cycle.repository';
import {SurveyResponseDetailRepository} from '../repositories/survey-response-detail.repository';
import {SurveyResponseRepository} from '../repositories/survey-response.repository';
import {SurveyRepository} from '../repositories/survey.repository';
import {isArray} from 'lodash';
import {SurveyResponderRepository} from '../repositories/survey-responder.repository';
import {AuthorizeErrorKeys} from 'loopback4-authorization';
import {SurveyServiceBindings} from '../keys';
import {SendReminderFunction} from '../types';

const dateFormat = 'DD MMM YYYY';
const sqlDateFormat = 'YYYY-MM-DD';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyResponseService {
  constructor(
    @repository(SurveyResponseRepository)
    public surveyResponseRepository: SurveyResponseRepository,
    @repository(SurveyResponseDetailRepository)
    public surveyResponseDetailRepository: SurveyResponseDetailRepository,
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @repository(SurveyCycleRepository)
    protected surveyCycleRepository: SurveyCycleRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @repository(SurveyResponderRepository)
    protected surveyResponderRepository: SurveyResponderRepository,
    @inject(SurveyServiceBindings.ReminderFunction)
    private readonly getReminderResponse: SendReminderFunction,
  ) {}

  async sendResponderReminderEmail(
    surveyId: string,
    responderReminderDto: ResponderReminderDto,
  ) {
    await this.getReminderResponse.sendReminder(surveyId, {
      responderIds: responderReminderDto,
    });
  }

  async sendSurveyResponseEmail(
    surveyId: string,
    surveyResponder: SurveyResponder,
  ) {
    await this.getReminderResponse.sendReminder(surveyId, {
      surveyResponder: surveyResponder,
    });
  }

  async createResponse(surveyId: string, surveyResponseDto: SurveyResponseDto) {
    const surveyResponseDetailsDto =
      surveyResponseDto.surveyResponseDetailArray;
    if (!surveyResponseDetailsDto) {
      throw new HttpErrors.BadRequest(ErrorKeys.SurveyResponseDetailNotFound);
    }
    delete surveyResponseDto.surveyResponseDetailArray;
    const survey = await this.surveyRepository.findById(surveyId, {
      include: [
        {
          relation: 'questions',
          scope: {
            include: [
              {
                relation: 'followUpQuestions',
                scope: {
                  include: [
                    {
                      relation: 'followUpQuestions',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'surveyCycles',
          scope: {
            where: {
              and: [
                {isActivated: true},
                {endDate: {gte: moment().format(sqlDateFormat)}},
                {startDate: {lte: moment().format(sqlDateFormat)}},
              ],
            },
            order: ['created_on DESC'],
          },
        },
      ],
    });

    const activeCycleId = this.validateSurveyCycleAndGetCycleId(
      survey.surveyCycles,
    );

    const surveyResponder = await this.validateAndGetResponder(
      surveyResponseDto.surveyResponderId,
      surveyId,
      activeCycleId,
    );

    const surveyResponse = new SurveyResponse({
      surveyResponderId: surveyResponseDto.surveyResponderId,
      surveyCycleId: activeCycleId,
    });

    await this.surveyResponseRepository.create(surveyResponse);

    // fetch createdSurveyResponse with id
    const createdSurveyResponse = await this.surveyResponseRepository.findOne({
      where: {
        and: [
          {surveyCycleId: activeCycleId},
          {surveyResponderId: surveyResponseDto.surveyResponderId},
        ],
      } as Where<SurveyResponse>,
      order: ['created_on DESC'],
    });
    if (!createdSurveyResponse?.id) {
      throw new HttpErrors.NotFound();
    }

    // create map of question with question id
    let questions: {[key: string]: Question} = {};
    if (survey?.questions?.length) {
      questions = this.getQuestionMapId(survey?.questions);
    }

    const surveyResponseDetails = this.handleSurveyResponseDetail(
      surveyResponseDetailsDto,
      questions,
      createdSurveyResponse.id,
    );

    await this.surveyResponseDetailRepository.createAll(surveyResponseDetails);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.sendSurveyResponseEmail(surveyId, surveyResponder).catch(err =>
      this.logger.error(JSON.stringify(err)),
    );

    return createdSurveyResponse;
  }

  validateSurveyCycleAndGetCycleId(surveyCycles: SurveyCycle[]) {
    if (!surveyCycles?.length || !surveyCycles[0].id) {
      throw new HttpErrors.Unauthorized(ErrorKeys.NotAuthorised);
    }
    return surveyCycles[0].id;
  }

  handleSurveyResponseDetail(
    surveyResponseDetailsDto: SurveyResponseDetailDto[],
    questions: {[key: string]: Question},
    surveyResponseId: string,
  ) {
    const surveyResponseDetails: SurveyResponseDetail[] = [];
    surveyResponseDetailsDto.forEach(questionResponse => {
      this.handleResponseWithType(
        questionResponse,
        surveyResponseDetails,
        questions[questionResponse.questionId],
        surveyResponseId,
      );
    });
    return surveyResponseDetails;
  }

  handleResponseWithType(
    surveyResponseDetailDto: SurveyResponseDetailDto,
    surveyResponseDetails: SurveyResponseDetail[],
    question: Question,
    surveyResponseId: string,
  ) {
    if (
      surveyResponseDetailDto.answer?.hasOwnProperty('optionId') &&
      [
        QuestionType.SCALE,
        QuestionType.DROPDOWN,
        QuestionType.SINGLE_SELECTION,
      ].includes(question?.questionType)
    ) {
      surveyResponseDetails.push(
        this.handleAnswer(
          surveyResponseDetailDto,
          surveyResponseId,
          question?.questionType,
          undefined,
          surveyResponseDetailDto.answer.optionId,
        ),
      );
    } else if (
      isArray(surveyResponseDetailDto.answer?.optionIds) &&
      QuestionType.MULTI_SELECTION === question.questionType
    ) {
      surveyResponseDetailDto.answer?.optionIds.forEach(optionId => {
        surveyResponseDetails.push(
          this.handleAnswer(
            surveyResponseDetailDto,
            surveyResponseId,
            QuestionType.MULTI_SELECTION,
            undefined,
            optionId,
          ),
        );
      });
    } else if (
      surveyResponseDetailDto.answer?.hasOwnProperty('text') &&
      QuestionType.TEXT === question.questionType
    ) {
      surveyResponseDetails.push(
        this.handleAnswer(
          surveyResponseDetailDto,
          surveyResponseId,
          QuestionType.TEXT,
          surveyResponseDetailDto.answer.text,
        ),
      );
    } else {
      throw new HttpErrors.BadRequest(ErrorKeys.NotAuthorised);
    }
  }

  handleAnswer(
    surveyResponseDetailDto: SurveyResponseDetailDto,
    surveyResponseId: string,
    questionType: QuestionType,
    textAnswer?: string,
    optionId?: string,
  ) {
    return new SurveyResponseDetail({
      surveyResponseId,
      questionId: surveyResponseDetailDto.questionId,
      score: surveyResponseDetailDto.score,
      responseType: questionType,
      textAnswer,
      optionId,
    });
  }

  getQuestionMapId(questions: Question[]) {
    // create map of question with question id
    let questionsMap: {[key: string]: Question} = {};
    if (questions?.length) {
      questions.forEach(question => {
        if (question.id) {
          questionsMap[question.id] = question;
          if (question.followUpQuestions?.length) {
            const followUpQuestionsMap = this.getQuestionMapId(
              question.followUpQuestions,
            );
            questionsMap = {...questionsMap, ...followUpQuestionsMap};
          }
        }
      });
    }
    return questionsMap;
  }

  /*
  combination = vendorName, domain and businessUnit.
  if all or any of two combination present then message will be 'You have already submitted response  for this vendorName, domain and businessUnit combination.'
  else if only one combination present then message will be 'You have already submitted response  for this vendorName.
  else message will be 'You have already submitted response.'
   */

  async validateAndGetResponder(
    responderId: string,
    surveyId: string,
    surveyCycleId: string,
  ) {
    const responder = await this.surveyResponderRepository.findOne({
      where: {
        id: responderId,
        surveyId,
        surveyCycleId,
      },
      fields: {fullName: true, email: true},
    });
    if (!responder) {
      throw new HttpErrors.Unauthorized(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return responder;
  }
}
