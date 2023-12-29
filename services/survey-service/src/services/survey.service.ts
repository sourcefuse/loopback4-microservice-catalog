import {BindingScope, inject, injectable, service} from '@loopback/core';
import {AnyObject, Filter, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import jsdom from 'jsdom';
import moment from 'moment';
import {SurveyStatus} from '../enum';
import {ErrorKeys} from '../enum/error-keys.enum';
import {QuestionStatus} from '../enum/question.enum';
import {QuestionTemplateStatus} from '../enum/template.enum';
import {Survey, SurveyDto, SurveyQuestion} from '../models';
import {QuestionRepository} from '../repositories';
import {QuestionTemplateRepository} from '../repositories/question-template.repository';
import {SurveyCycleRepository} from '../repositories/survey-cycle.repository';
import {SurveyQuestionRepository} from '../repositories/survey-question.repository';
import {SurveyResponderRepository} from '../repositories/survey-responder.repository';
import {SurveyRepository} from '../repositories/survey.repository';
import {TemplateQuestionRepository} from '../repositories/template-questions.repository';
import {unescapeHtml} from '../utils/html.utils';
import {CreateSurveyHelperService} from './create-survey-helper.service';
import {SurveyCycleService} from './survey-cycle.service';
const {JSDOM} = jsdom;

const orderByCreatedOn = 'created_on DESC';
const defaultLeadingZero = 6;
const MaxSurvetTextLength = 2500;
const DATE_FORMAT = 'YYYY-MM-DD';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyService {
  constructor(
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @repository(QuestionTemplateRepository)
    public questionTemplateRepository: QuestionTemplateRepository,
    @repository(TemplateQuestionRepository)
    public templateQuestionRepository: TemplateQuestionRepository,
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,
    @repository(SurveyCycleRepository)
    public surveyCycleRepository: SurveyCycleRepository,
    @repository(SurveyResponderRepository)
    protected surveyResponderRepository: SurveyResponderRepository,
    @repository(QuestionRepository)
    protected questionRepository: QuestionRepository,

    @service(SurveyCycleService)
    public surveyCycleService: SurveyCycleService,
    @inject('services.CreateSurveyHelperService')
    public createSurveyHelperService: CreateSurveyHelperService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  async createSurvey(survey: Omit<SurveyDto, 'id'>) {
    const templateId = survey.existingTemplateId;
    survey = await this.createSurveyHelperService.copyFromBaseSurvey(survey);
    await this._checkBasicSurveyValidations(survey);

    // create survey
    if (survey.surveyText) {
      survey.surveyText = unescapeHtml(survey.surveyText) as unknown as string;
      const title = this.getHtmlTextContent(survey.surveyText);
      this.validateTitleLength(title);
    }
    let existingQuestionTemplate;
    if (templateId) {
      existingQuestionTemplate = await this.questionTemplateRepository.findOne({
        fields: ['id', 'isEnableWeight'],
        where: {id: survey.existingTemplateId},
      });
    }

    if (!survey.baseSurveyId && existingQuestionTemplate?.isEnableWeight) {
      survey.isEnableWeights = true;
    }
    const surveyId = await this.generateSurveyId();
    survey.uid = surveyId;
    delete survey.existingTemplateId;
    await this.surveyRepository.create(survey);

    // fetch createdSurvey with id
    const createdSurvey = await this.surveyRepository.findOne({
      where: {uid: surveyId},
    });
    if (!createdSurvey) {
      throw new HttpErrors.NotFound();
    }

    this.handleSurveyStatus(createdSurvey.id as string, createdSurvey).catch(
      err => this.logger.error(JSON.stringify(err)),
    );

    const questionIdMap: Map<string, string> = new Map();
    //key contains old question id     //value contains new question id

    const sectionIdMap: Map<string, string> = new Map();

    //find exisiting questions only of baseSurvey and create copies of them, store ids in pairs
    if (!survey.baseSurveyId && templateId) {
      const existingTemplateQuestions =
        await this.templateQuestionRepository.find({
          where: {templateId: templateId},
        });
      const surveyQuestionsToCreate: SurveyQuestion[] = [];
      existingTemplateQuestions?.forEach(existingTemplateQuestion => {
        const surveyQuestion = new SurveyQuestion();
        surveyQuestion.displayOrder = (existingTemplateQuestion.displayOrder ??
          0) as number;
        surveyQuestion.isMandatory =
          existingTemplateQuestion.isMandatory as boolean;
        surveyQuestion.questionId = existingTemplateQuestion.questionId;
        surveyQuestion.weight = existingTemplateQuestion.weight;
        surveyQuestion.surveyId = createdSurvey.id as string;
        surveyQuestionsToCreate.push(surveyQuestion);
      });
      if (surveyQuestionsToCreate.length)
        await this.surveyQuestionRepository.createAll(surveyQuestionsToCreate);

      await this.createSurveyHelperService.addDependentOnQuestionId(
        createdSurvey.id as string,
        existingTemplateQuestions,
      );
    }

    //copy survey specific questions in case of duplication
    if (survey.baseSurveyId) {
      await Promise.all([
        await this.createSurveyHelperService.duplicateSections(
          createdSurvey?.id ?? '',
          survey.baseSurveyId,
          sectionIdMap,
        ),
        await this.createSurveyHelperService.duplicateRespondersAndWorkgroups(
          survey.baseSurveyId,
          createdSurvey?.id ?? '',
        ),
      ]);
      await this.createSurveyHelperService.duplicateSurveyQuestionEntry(
        survey,
        createdSurvey,
        questionIdMap,
        sectionIdMap,
      );
    }
    return createdSurvey;
  }

  private _checkDateValidationForPatchCase(
    survey: Survey,
    existingSurvey: Survey,
  ) {
    // means patch request contains at least one date change
    if (survey.startDate && !survey.status) {
      throw new HttpErrors.BadRequest(
        ErrorKeys.SurveyStartDateShouldBeCurrentDate,
      );
    }

    survey.startDate =
      survey.startDate ??
      moment(new Date(existingSurvey.startDate)).format(DATE_FORMAT);

    survey.endDate =
      survey.endDate ??
      moment(new Date(existingSurvey.endDate)).format(DATE_FORMAT);

    this._checkSurveyDateValidations(survey);
  }

  private async _checkBasicSurveyValidations(
    surveyRequest: SurveyDto,
    existingSurvey?: SurveyDto,
  ) {
    const survey = new SurveyDto(surveyRequest);
    if (existingSurvey) {
      this._checkDateValidationForPatchCase(survey, existingSurvey);
    } else {
      this._checkSurveyDateValidations(survey);
    }

    // name should not contain all spaces
    if (survey?.name && !survey.name.trim().length) {
      throw new HttpErrors.BadRequest(ErrorKeys.InvalidName);
    }

    // questionnaire should be approved before using in a survey
    if (survey.existingTemplateId) {
      const questionnaire = await this.questionTemplateRepository.findOne({
        where: {id: survey.existingTemplateId},
      });
      if (!questionnaire) {
        throw new HttpErrors.BadRequest('Invalid Template Id');
      }
      if (questionnaire.status !== QuestionTemplateStatus.APPROVED) {
        throw new HttpErrors.BadRequest(
          ErrorKeys.AddApprovedQuestionTemplateId,
        );
      }
    }
  }

  private _checkSurveyDateValidations(survey: Survey) {
    //CASE 1 -> Only start date is present.
    if (survey?.startDate && survey?.status === SurveyStatus.ACTIVE) {
      if (
        moment(survey.startDate).format(DATE_FORMAT) !==
        moment().utc().format(DATE_FORMAT)
      ) {
        //start date should be current date only and status active.
        throw new HttpErrors.BadRequest(
          ErrorKeys.SurveyStartDateShouldBeCurrentDate,
        );
      }
    }

    //CASE 2 -> Both start date and end date are present
    if (survey?.startDate && survey?.endDate) {
      // end date can not be less than start date
      if (survey?.startDate > survey?.endDate) {
        throw new HttpErrors.BadRequest(ErrorKeys.EndDateCanNotBeLess);
      }
    }

    // CASE 3 -> Only end date is present.
    if (
      survey?.endDate &&
      !survey?.startDate &&
      survey?.status === SurveyStatus.ACTIVE
    ) {
      throw new HttpErrors.BadRequest(ErrorKeys.SurveyCannotBeActivated);
    }

    //CASE 4 -> If neither end date nor start date is present

    if (
      !survey?.endDate &&
      !survey?.startDate &&
      survey?.status === SurveyStatus.ACTIVE
    ) {
      throw new HttpErrors.BadRequest(ErrorKeys.SurveyCannotBeActivated);
    }

    //CASE 5 -> start date cannot be present with status draft
    if (survey?.startDate && survey?.status === SurveyStatus.DRAFT) {
      throw new HttpErrors.BadRequest(
        ErrorKeys.SurveyCannotBeActivatedInDraftState,
      );
    }

    this.checkPastDateValidation(survey);
  }

  checkPastDateValidation(survey: Survey) {
    if (survey?.endDate && moment(survey?.endDate).isBefore(moment())) {
      throw new HttpErrors.BadRequest(ErrorKeys.EndDateCannotBeInPast);
    }
  }

  private getHtmlTextContent(html?: string) {
    const dom = new JSDOM(html);
    return dom?.window?.document?.body?.textContent ?? '';
  }

  validateTitleLength(title: string) {
    if (title?.length > MaxSurvetTextLength) {
      throw new HttpErrors.BadRequest(ErrorKeys.MaxSurveyTextLength);
    }
  }

  async updateSurvey(id: string, survey: SurveyDto) {
    const existingSurvey = await this.surveyRepository.findOne({
      where: {id},
    });
    if (!existingSurvey) {
      throw new HttpErrors.NotFound();
    }
    await this._checkBasicSurveyValidations(survey, existingSurvey);
    // unescape survey text to store in db and validate it
    if (survey.surveyText) {
      survey.surveyText = unescapeHtml(survey.surveyText) as unknown as string;
      const title = this.getHtmlTextContent(survey.surveyText);
      this.validateTitleLength(title);
    }

    if (survey.status) {
      const todayDate = moment().format(moment.HTML5_FMT.DATE);
      if (new Date(existingSurvey.endDate) > new Date(todayDate)) {
        survey.endDate = todayDate;
      }
    }

    await this.surveyRepository.updateById(id, survey);
    this.handleSurveyStatus(id, survey).catch(err =>
      this.logger.error(JSON.stringify(err)),
    );
  }

  async checkIfAllowedToUpdateSurvey(id: string) {
    const existingSurvey = await this.surveyRepository.findOne({
      where: {id},
    });
    if (!existingSurvey) {
      throw new HttpErrors.NotFound('Invalid survey Id!');
    }
  }

  private async handleSurveyStatus(id: string, survey: Survey) {
    if (survey.status === SurveyStatus.ACTIVE) {
      this.handleSurveyApprove(id, survey).catch(err =>
        this.logger.error(JSON.stringify(err)),
      );
    } else {
      // do nothing
    }
  }

  async handleSurveyApprove(id: string, updateSurvey: Survey) {
    await Promise.all([
      this.handleSurveyStatusApprove(id, SurveyStatus.ACTIVE),
      this.approveSurveyQuestions(id),
      this.surveyCycleService.createFirstSurveyCycle(id),
    ]);
  }

  async handleSurveyStatusApprove(id: string, status: SurveyStatus) {
    const resp = await this.surveyRepository.updateById(id, {
      status,
    });
    return resp;
  }

  async approveSurveyQuestions(surveyId: string) {
    const promiseArr: AnyObject[] = [];
    const updateObj: AnyObject = {status: QuestionStatus.APPROVED};

    promiseArr.push(
      this.questionRepository.updateAll(updateObj, {
        surveyId,
        status: QuestionStatus.ADDED_TO_SURVEY,
      }),
    );

    await Promise.all(promiseArr);
  }

  async generateSurveyId(): Promise<string> {
    const surveyIdPrefix = 'S';
    const sequenceStart = `000001`;
    const lastInsertedSurvey =
      await this.surveyRepository.findOneIncludeSoftDelete({
        fields: ['uid'],
        order: [orderByCreatedOn],
      });

    const sequence = parseInt(
      lastInsertedSurvey?.uid?.substring(
        surveyIdPrefix.length,
        lastInsertedSurvey?.uid?.length,
      ) ?? sequenceStart,
    );

    return `${surveyIdPrefix}${this._addLeadingZero(
      sequence + 1,
      defaultLeadingZero,
    )}`;
  }
  private _addLeadingZero(number: number, size: number): string {
    let valueWithLeadingZero = number.toString();
    if (valueWithLeadingZero.length === defaultLeadingZero) {
      size += 1;
    }
    while (valueWithLeadingZero.length < size)
      valueWithLeadingZero = '0' + valueWithLeadingZero;
    return valueWithLeadingZero;
  }
  async checkDeleteValidation(surveyId: string) {
    const survey = await this.surveyRepository.findById(surveyId);
    if (survey.status !== SurveyStatus.DRAFT) {
      throw new HttpErrors.BadRequest(ErrorKeys.SurveyCanNotBeDeleted);
    }
  }
  async deleteRelatedObjects(surveyId: string) {
    // delete related survey questions
    const surveyQuestions = await this.surveyQuestionRepository.find({
      where: {surveyId},
      fields: ['id'],
    });
    if (surveyQuestions.length) {
      this.surveyQuestionRepository
        .deleteAllHard({
          id: {
            inq: surveyQuestions.map(surveyQuestion => surveyQuestion.id),
          },
        })
        .catch(err => this.logger.error(JSON.stringify(err)));
    }
  }

  async updateModifiedByAndOn(surveyId: string) {
    await this.surveyRepository.updateById(surveyId, {
      id: surveyId,
    });
  }

  async validateAndGetSurvey(surveyId: string, filter: Filter<Survey> = {}) {
    const foundSurvey = await this.surveyRepository.findOne({
      ...filter,
      where: {
        id: surveyId,
      },
    });
    if (!foundSurvey) {
      throw new HttpErrors.BadRequest('Invalid survey Id');
    }
    return foundSurvey;
  }
}
