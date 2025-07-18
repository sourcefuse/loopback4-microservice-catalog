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
import {Survey, SurveyDto} from '../models';
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

  /**
   * This function creates a survey, performs various validations and operations, and returns the
   * created survey.
   * @param survey - The `createSurvey` function takes a parameter `survey` of type `SurveyDto`, but
   * with the `id` property omitted. The function performs several tasks such as copying survey data
   * from a base survey, performing validations, setting weight flags, generating a unique survey ID,
   * creating a new survey in
   * @returns The `createSurvey` function returns the created survey object after performing various
   * operations such as copying from a base survey, setting weight flag, generating a survey ID,
   * creating the survey in the repository, handling survey status, creating questions from a template
   * (if applicable), and duplicating survey details (if applicable).
   */
  async createSurvey(survey: Omit<SurveyDto, 'id'>) {
    const templateId = survey.existingTemplateId;
    survey = await this.createSurveyHelperService.copyFromBaseSurvey(survey);
    await this._checkBasicSurveyValidations(survey);

    if (survey.surveyText) {
      this._processSurveyText(survey);
    }

    await this._setWeightFlagIfRequired(survey, templateId);

    const surveyId = await this.generateSurveyId();
    survey.uid = surveyId;
    delete survey.existingTemplateId;
    await this.surveyRepository.create(survey);

    const createdSurvey = await this.surveyRepository.findOne({
      where: {uid: surveyId},
    });
    if (!createdSurvey) throw new HttpErrors.NotFound();

    this.handleSurveyStatus(createdSurvey.id as string, createdSurvey).catch(
      err => this.logger.error(JSON.stringify(err)),
    );

    if (!survey.baseSurveyId && templateId) {
      await this._createQuestionsFromTemplate(
        templateId,
        createdSurvey.id as string,
      );
    }

    if (survey.baseSurveyId) {
      await this._duplicateSurveyDetails(survey, createdSurvey);
    }

    return createdSurvey;
  }

  /**
   * The _processSurveyText function processes survey text by unescaping HTML characters, extracting
   * the title, and validating its length.
   * @param survey - The `survey` parameter is an object of type `SurveyDto` with the `id` property
   * omitted. It likely contains information related to a survey, such as the survey text.
   */
  private _processSurveyText(survey: Omit<SurveyDto, 'id'>) {
    survey.surveyText = unescapeHtml(survey.surveyText) as unknown as string;
    const title = this.getHtmlTextContent(survey.surveyText);
    this.validateTitleLength(title);
  }

  /**
   * This function sets a weight flag on a survey if a specific condition is met.
   * @param survey - The `survey` parameter is an object of type `SurveyDto` with the `id` property
   * omitted. It likely contains information related to a survey, such as its title, questions,
   * options, etc.
   * @param {string} [templateId] - The `templateId` parameter is an optional string that represents
   * the ID of a question template. It is used in the `_setWeightFlagIfRequired` method to check if a
   * survey has a base survey ID and if a template ID is provided. If a template ID is provided and the
   * corresponding template
   */
  private async _setWeightFlagIfRequired(
    survey: Omit<SurveyDto, 'id'>,
    templateId?: string,
  ) {
    if (!survey.baseSurveyId && templateId) {
      const existingTemplate = await this.questionTemplateRepository.findOne({
        fields: ['id', 'isEnableWeight'],
        where: {id: templateId},
      });
      if (existingTemplate?.isEnableWeight) {
        survey.isEnableWeights = true;
      }
    }
  }

  /**
   * The function `_createQuestionsFromTemplate` creates survey questions based on a template and adds
   * them to a survey.
   * @param {string} templateId - The `templateId` parameter is a string that represents the unique
   * identifier of a template from which questions will be created for a survey.
   * @param {string} surveyId - The `surveyId` parameter is a string that represents the unique
   * identifier of a survey. It is used to associate the questions created from a template with a
   * specific survey.
   */
  private async _createQuestionsFromTemplate(
    templateId: string,
    surveyId: string,
  ) {
    const questions = await this.templateQuestionRepository.find({
      where: {templateId},
    });
    const surveyQuestions = questions.map(q => ({
      displayOrder: q.displayOrder ?? 0,
      isMandatory: q.isMandatory ?? false,
      questionId: q.questionId,
      weight: q.weight,
      surveyId,
    }));
    if (surveyQuestions.length) {
      await this.surveyQuestionRepository.createAll(surveyQuestions);
      await this.createSurveyHelperService.addDependentOnQuestionId(
        surveyId,
        questions,
      );
    }
  }

  /**
   * The _duplicateSurveyDetails function duplicates survey details, sections, responders, workgroups,
   * and survey questions.
   * @param survey - The `survey` parameter is an object of type `SurveyDto` with the `id` property
   * omitted. It contains details of a survey that needs to be duplicated.
   * @param {SurveyDto} createdSurvey - The `_duplicateSurveyDetails` function takes in two parameters:
   * `survey` and `createdSurvey`. The `createdSurvey` parameter is of type `SurveyDto`, which
   * represents a survey object. It contains details about a survey that has been created, including an
   * `id` property.
   */
  private async _duplicateSurveyDetails(
    survey: Omit<SurveyDto, 'id'>,
    createdSurvey: SurveyDto,
  ) {
    const sectionIdMap = new Map<string, string>();
    const questionIdMap = new Map<string, string>();
    const surveyId = createdSurvey.id ?? '';

    await Promise.all([
      this.createSurveyHelperService.duplicateSections(
        surveyId,
        survey.baseSurveyId ?? '',
        sectionIdMap,
      ),
      this.createSurveyHelperService.duplicateRespondersAndWorkgroups(
        survey.baseSurveyId ?? '',
        surveyId,
      ),
    ]);

    await this.createSurveyHelperService.duplicateSurveyQuestionEntry(
      survey,
      createdSurvey,
      questionIdMap,
      sectionIdMap,
    );
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
    const {startDate, endDate, status} = survey;

    const isActive = status === SurveyStatus.ACTIVE;
    const isDraft = status === SurveyStatus.DRAFT;

    // CASE 1: startDate is present with Active status — must match current date
    if (startDate && isActive) {
      const isSameDate =
        moment(startDate).format(DATE_FORMAT) ===
        moment().utc().format(DATE_FORMAT);
      if (!isSameDate) {
        throw new HttpErrors.BadRequest(
          ErrorKeys.SurveyStartDateShouldBeCurrentDate,
        );
      }
    }

    // CASE 2: Both startDate and endDate are present — endDate cannot be before startDate
    if (startDate && endDate && startDate > endDate) {
      throw new HttpErrors.BadRequest(ErrorKeys.EndDateCanNotBeLess);
    }

    // CASE 3 & 4: endDate is present without startDate OR neither date is present, both with status Active
    if (isActive && (!startDate || !endDate)) {
      throw new HttpErrors.BadRequest(ErrorKeys.SurveyCannotBeActivated);
    }

    // CASE 5: startDate is present with Draft status — invalid
    if (startDate && isDraft) {
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
