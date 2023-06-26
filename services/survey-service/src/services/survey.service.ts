import {injectable, BindingScope, inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import moment from 'moment';
import {Survey, SurveyDto, SurveyQuestion} from '../models';
import {SurveyRecurrenceFrequency, SurveyStatus} from '../enum/question.enum';
import {ErrorKeys} from '../enum/error-keys.enum';
import {SurveyRepository} from '../repositories/survey.repository';
import {QuestionTemplateRepository} from '../repositories/question-template.repository';
import {TemplateQuestionRepository} from '../repositories/template-questions.repository';
import {SurveyQuestionRepository} from '../repositories/survey-question.repository';
import {SurveyCycleRepository} from '../repositories/survey-cycle.repository';
import {SurveyResponderRepository} from '../repositories/survey-responder.repository';
import {CreateSurveyHelperService} from './create-survey-helper.service';
import {QuestionTemplateStatus} from '../enum/template.enum';
import {unescapeHtml} from '../utils/html.utils';
import jsdom from 'jsdom';
const {JSDOM} = jsdom;

const orderByCreatedOn = 'created_on DESC';
const defaultLeadingZero = 6;
const MaxSurvetTextLength = 2500;
const DATE_FORMAT = 'YYYY-MM-DD';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyService {
  constructor(
    @repository(SurveyRepository)
    private surveyRepository: SurveyRepository,
    @repository(QuestionTemplateRepository)
    private questionTemplateRepository: QuestionTemplateRepository,
    @repository(TemplateQuestionRepository)
    private templateQuestionRepository: TemplateQuestionRepository,
    @repository(SurveyQuestionRepository)
    private surveyQuestionRepository: SurveyQuestionRepository,
    @repository(SurveyCycleRepository)
    private surveyCycleRepository: SurveyCycleRepository,
    @repository(SurveyResponderRepository)
    protected surveyResponderRepository: SurveyResponderRepository,
    @inject('services.CreateSurveyHelperService')
    private createSurveyHelperService: CreateSurveyHelperService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  async createSurvey(survey: Omit<SurveyDto, 'id'>) {
    const templateId = survey.existingTemplateId;
    survey = await this.createSurveyHelperService.copyFromBaseSurvey(survey);

    if (survey.status !== SurveyStatus.DRAFT) {
      throw new HttpErrors.BadRequest(ErrorKeys.InvalidStatus);
    }
    await this._checkBasicSurveyValidations(survey);
    this._checkRecurrenceDateValidations(survey);

    // create survey
    const occurrences = survey.recurrenceEndAfterOccurrences;
    if (survey.isPeriodicReassessment && occurrences) {
      survey.recurrenceEndDate = this.calculateRecurrenceEndDate(
        survey.endDate,
        survey.recurrenceFrequency as SurveyRecurrenceFrequency,
        occurrences,
      );
    }
    if (survey.surveyText) {
      survey.surveyText = unescapeHtml(survey.surveyText) as string;
      const title = this.getHtmlTextContent(survey.surveyText);
      this.validateTitleLength(title);
    }
    const existingQuestionTemplate =
      await this.questionTemplateRepository.findOne({
        fields: ['id', 'isEnableWeight'],
        where: {id: survey.existingTemplateId},
      });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (!survey.baseSurveyId && existingQuestionTemplate?.isEnableWeight) {
      survey.isEnableWeights = true;
    }
    const surveyId = await this.generateSurveyId();
    survey.uid = surveyId;
    survey.status = SurveyStatus.DRAFT;
    delete survey.existingTemplateId;
    await this.surveyRepository.create(survey);

    // fetch createdSurvey with id
    const createdSurvey = await this.surveyRepository.findOne({
      where: {uid: surveyId},
    });
    if (!createdSurvey) {
      throw new HttpErrors.NotFound();
    }

    const questionIdMap: Map<string, string> = new Map();
    //key contains old question id     //value contains new question id

    const sectionIdMap: Map<string, string> = new Map();

    //find exisiting questions only of baseSurvey and create copies of them, store ids in pairs
    if (!survey.baseSurveyId) {
      const existingTemplateQuestions =
        await this.templateQuestionRepository.find({
          where: {templateId: templateId},
        });
      const surveyQuestionsToCreate: SurveyQuestion[] = [];
      existingTemplateQuestions.forEach(existingTemplateQuestion => {
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

  private async _checkDateValidationForPatchCase(
    survey: Survey,
    existingSurvey: Survey,
  ) {
    // means patch request contains at least one date change
    if (
      !(survey.startDate || survey.endDate || survey.recurrenceEndDate) &&
      !survey.status
    ) {
      return;
    }

    survey.startDate =
      survey.startDate ??
      moment(new Date(existingSurvey.startDate)).format(DATE_FORMAT);
    survey.endDate =
      survey.endDate ??
      moment(new Date(existingSurvey.endDate)).format(DATE_FORMAT);
    if (!survey.recurrenceEndDate && existingSurvey.recurrenceEndDate) {
      survey.recurrenceEndDate = moment(
        new Date(existingSurvey.recurrenceEndDate),
      ).format(DATE_FORMAT);
    }

    await this._checkSurveyDateValidations(survey);
  }

  private async _checkBasicSurveyValidations(
    surveyRequest: SurveyDto,
    existingSurvey?: SurveyDto,
  ) {
    const survey = new SurveyDto(surveyRequest);
    if (existingSurvey) {
      await this._checkDateValidationForPatchCase(survey, existingSurvey);
    } else {
      await this._checkSurveyDateValidations(survey);
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
        throw new HttpErrors.BadRequest('Invalid Questionnaire Id');
      }
      if (questionnaire.status !== QuestionTemplateStatus.APPROVED) {
        throw new HttpErrors.BadRequest(
          ErrorKeys.AddApprovedQuestionTemplateId,
        );
      }
    }

    // recurrenceEndAfterOccurrences should not be in decimal
    if (
      survey.recurrenceEndAfterOccurrences &&
      !Number.isInteger(survey.recurrenceEndAfterOccurrences)
    ) {
      throw new HttpErrors.BadRequest(ErrorKeys.DecimalValueNotSupported);
    }
  }

  private async _checkSurveyDateValidations(survey: Survey) {
    // do not check date validations when marking survey expired
    if (survey.status && survey.status === SurveyStatus.Expired) {
      return;
    }

    // end date can not be less than start date
    if (survey.startDate > survey.endDate) {
      throw new HttpErrors.BadRequest(ErrorKeys.EndDateCanNotBeLess);
    }

    // recurrence end date can not be less than start date
    if (
      survey.recurrenceEndDate &&
      survey.startDate > survey.recurrenceEndDate
    ) {
      throw new HttpErrors.BadRequest(ErrorKeys.RecurrenceEndDateCanNotBeLess);
    }

    // start date can not be in past
    if (survey.startDate < moment().format(DATE_FORMAT)) {
      throw new HttpErrors.BadRequest(ErrorKeys.PastDateNotAllowed);
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

  calculateRecurrenceEndDate(
    surveyEndDate: string,
    recurrenceFrequency: SurveyRecurrenceFrequency,
    occurrences: number,
  ) {
    // means we need to calculate recurrenceEndDate based on recurrenceEndAfterOccurrences
    const endDate = new Date(surveyEndDate);
    switch (recurrenceFrequency) {
      case SurveyRecurrenceFrequency.Monthly:
        endDate.setMonth(endDate.getMonth() + occurrences);
        break;
      case SurveyRecurrenceFrequency.Quarterly:
        // eslint-disable-next-line no-case-declarations
        const monthInQuarter = 3;
        endDate.setMonth(endDate.getMonth() + monthInQuarter * occurrences);
        break;
      case SurveyRecurrenceFrequency.Biannually:
        // eslint-disable-next-line no-case-declarations
        const monthInBiAnnullay = 6;
        endDate.setMonth(endDate.getMonth() + monthInBiAnnullay * occurrences);
        break;
      case SurveyRecurrenceFrequency.Annually:
        // eslint-disable-next-line no-case-declarations
        const monthInAnnullay = 12;
        endDate.setMonth(endDate.getMonth() + monthInAnnullay * occurrences);
        break;
    }
    return moment(endDate).format(DATE_FORMAT);
  }

  async updateSurvey(id: string, survey: SurveyDto) {
    const existingSurvey = await this.surveyRepository.findOne({
      where: {id},
    });
    if (!existingSurvey) {
      throw new HttpErrors.NotFound();
    }
    await this._checkBasicSurveyValidations(survey, existingSurvey);
    this.checkIfAllowedToUpdate(existingSurvey, survey);
    // unescape survey text to store in db and validate it
    if (survey.surveyText) {
      survey.surveyText = unescapeHtml(survey.surveyText) as string;
      const title = this.getHtmlTextContent(survey.surveyText);
      this.validateTitleLength(title);
    }

    survey = this._handleRecurrenceDateChanges(existingSurvey, survey);

    if (survey.status && survey.status === SurveyStatus.Expired) {
      const todayDate = moment().format(moment.HTML5_FMT.DATE);
      if (existingSurvey.isPeriodicReassessment) {
        survey.recurrenceEndDate = todayDate;
      }
      if (new Date(existingSurvey.endDate) > new Date(todayDate)) {
        survey.endDate = todayDate;
      }
    }

    await this.surveyRepository.updateById(id, survey);
    this.handleSurveyStatus(id, existingSurvey, survey).catch(err =>
      this.logger.error(JSON.stringify(err)),
    );
  }

  private _handleRecurrenceDateChanges(
    existingSurvey: Survey,
    surveyToUpdate: SurveyDto,
  ) {
    this._checkRecurrenceDateValidations(surveyToUpdate);

    if (surveyToUpdate.isPeriodicReassessment === false) {
      surveyToUpdate.recurrenceEndAfterOccurrences = null;
      surveyToUpdate.recurrenceEndDate = null;
      surveyToUpdate.recurrenceFrequency = null;
      return surveyToUpdate;
    }

    // when user select no end date then UI should pass recurrenceEndDate: null
    // or when user selects a recurrence end date
    if (
      surveyToUpdate.recurrenceEndDate === null ||
      surveyToUpdate.recurrenceEndDate
    ) {
      surveyToUpdate.recurrenceEndAfterOccurrences = null;
    }
    // case: user set number of occurrences
    else if (
      surveyToUpdate.recurrenceEndAfterOccurrences === 0 ||
      surveyToUpdate.recurrenceEndAfterOccurrences
    ) {
      const endDate = surveyToUpdate.endDate ?? existingSurvey.endDate;
      const recurrenceFrequency =
        surveyToUpdate.recurrenceFrequency ??
        existingSurvey.recurrenceFrequency;
      surveyToUpdate.recurrenceEndDate = this.calculateRecurrenceEndDate(
        endDate,
        recurrenceFrequency as SurveyRecurrenceFrequency,
        surveyToUpdate.recurrenceEndAfterOccurrences,
      );
    } else {
      // do nothing
    }
    return surveyToUpdate;
  }

  private _checkRecurrenceDateValidations(survey: Survey) {
    // if both passed in a request
    if (
      // eslint-disable-next-line no-prototype-builtins
      survey.hasOwnProperty('recurrenceEndDate') &&
      // eslint-disable-next-line no-prototype-builtins
      survey.hasOwnProperty('recurrenceEndAfterOccurrences')
    ) {
      throw new HttpErrors.BadRequest(
        ErrorKeys.PassOneOfSurveyRecurrenceDateOrOccurrences,
      );
    }

    if (survey.isPeriodicReassessment) {
      // if isPeriodicReassessment is true and frequency is missing
      if (!survey.recurrenceFrequency) {
        throw new HttpErrors.BadRequest(
          ErrorKeys.SurveyRecurrenceFrequencyMissing,
        );
      }
      // if isPeriodicReassessment is true and neither recurrenceEndDate nor recurrenceEndAfterOccurrences is passed
      if (
        !survey.hasOwnProperty('recurrenceEndDate') &&
        !survey.hasOwnProperty('recurrenceEndAfterOccurrences')
      ) {
        throw new HttpErrors.BadRequest(
          ErrorKeys.PassOneOfSurveyRecurrenceDateOrOccurrences,
        );
      }
    } else if (
      survey.isPeriodicReassessment === false &&
      (survey.hasOwnProperty('recurrenceFrequency') ||
        survey.hasOwnProperty('recurrenceEndDate') ||
        survey.hasOwnProperty('recurrenceEndAfterOccurrences'))
    ) {
      throw new HttpErrors.BadRequest(ErrorKeys.RemoveExtraParams);
    } else {
      // do nothing
    }
  }

  async checkIfAllowedToUpdateSurvey(id: string) {
    const existingSurvey = await this.surveyRepository.findOne({
      where: {id},
    });
    if (!existingSurvey) {
      throw new HttpErrors.NotFound('Invalid survey Id!');
    }
    this.checkIfAllowedToUpdate(existingSurvey, undefined);
  }

  private async handleSurveyStatus(
    id: string,
    existingSurvey: Survey,
    updateSurvey: Survey,
  ) {
    if (updateSurvey.status === SurveyStatus.Expired) {
      if (
        [SurveyStatus.APPROVED, SurveyStatus.COMPLETED].includes(
          existingSurvey.status,
        )
      ) {
        // delete the next cycle which is not started yet
        this.surveyCycleRepository.deleteAll({
          surveyId: existingSurvey.id,
          isActivated: false,
        });
      } else if (existingSurvey.status === SurveyStatus.ACTIVE) {
        // update end date to today's date of current cycle
        this.surveyCycleRepository.updateAll(
          {endDate: moment().format(moment.HTML5_FMT.DATE)},
          {
            surveyId: existingSurvey.id,
            endDate: {gt: moment().format(moment.HTML5_FMT.DATE)},
          },
        );
      } else {
        // do nothing
      }
    } else {
      // do nothing
    }
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
      lastInsertedSurvey?.uid.substring(
        surveyIdPrefix.length,
        lastInsertedSurvey?.uid.length,
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
    if (![SurveyStatus.DRAFT, SurveyStatus.APPROVED].includes(survey.status)) {
      throw new HttpErrors.BadRequest(ErrorKeys.SurveyCanNotBeDeleted);
    }
  }

  async deleteRelatedObjects(surveyId: string) {
    const survey = await this.surveyRepository.findById(surveyId);

    // delete related survey questions
    const surveyQuestions = await this.surveyQuestionRepository.find({
      where: {surveyId},
      fields: ['id'],
    });
    if (surveyQuestions.length) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

  private checkIfAllowedToUpdate(
    existingSurvey: Survey,
    updateSurvey?: Survey,
  ) {
    // if marking survey as expired in any status other than active, completed or approved throw error
    if (
      updateSurvey?.status === SurveyStatus.Expired &&
      ![
        SurveyStatus.ACTIVE,
        SurveyStatus.APPROVED,
        SurveyStatus.COMPLETED,
      ].includes(existingSurvey.status)
    ) {
      throw new HttpErrors.BadRequest(ErrorKeys.NotAuthorised);
    }
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
  async addSurveyQuestion(
    displayOrder: number,
    questionId: string,
    surveyId: string,
  ) {
    const surveyQuestion = new SurveyQuestion({
      displayOrder,
      questionId,
    });

    surveyQuestion.surveyId = surveyId;
    await this.surveyQuestionRepository.create(surveyQuestion);

    // fetch createdSurveyQuestion with id
    const createdSurveyQuestion = await this.surveyQuestionRepository.findOne({
      order: [orderByCreatedOn],
    });
    if (!createdSurveyQuestion) {
      throw new HttpErrors.NotFound();
    }

    return createdSurveyQuestion;
  }
}
