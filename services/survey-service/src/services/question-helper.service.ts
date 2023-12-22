import {BindingScope, inject, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthorizeErrorKeys} from 'loopback4-authorization';
import {ErrorKeys} from '../enum/error-keys.enum';
import {QuestionStatus, QuestionType} from '../enum/question.enum';
import {Question} from '../models';
import {QuestionDto} from '../models/question-dto.model';
import {QuestionRepository} from '../repositories';
import {OptionsRepository} from '../repositories/options.repository';
import {SurveyQuestionRepository} from '../repositories/survey-question.repository';
import {TemplateQuestionRepository} from '../repositories/template-questions.repository';
import {SurveyService} from './survey.service';
const defaultLeadingZero = 5;
const noOfOptionsByDefault = 2;
const orderByCreatedOn = 'created_on DESC';

@injectable({scope: BindingScope.TRANSIENT})
export class QuestionHelperService {
  constructor(
    @repository(QuestionRepository)
    public questionRepository: QuestionRepository,
    @repository(OptionsRepository)
    public optionsRepository: OptionsRepository,
    @repository(TemplateQuestionRepository)
    public templateQuestionRepository: TemplateQuestionRepository,
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,
    @service(SurveyService)
    public surveyService: SurveyService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  async createQuestion(
    question: QuestionDto,
    status: string = QuestionStatus.DRAFT,
  ): Promise<Question> {
    if (question.status && question.status !== QuestionStatus.ADDED_TO_SURVEY) {
      throw new HttpErrors.BadRequest(AuthorizeErrorKeys.NotAllowedAccess);
    }

    if (question.status) {
      status = question.status;
    }

    await this.validateParentQuestion(question.parentQuestionId);

    const uid = await this.generateQuestionUuid();
    const optionId = question.optionId;
    delete question.optionId;

    const newQuestion = new Question({
      ...question,
      status,
      uid,
    });
    if (newQuestion.name) {
      newQuestion.name = newQuestion.name.trim();
    }
    if (optionId) {
      return this._createFollowupQuestion(newQuestion, optionId);
    }
    if (question.questionType === QuestionType.SCALE) {
      newQuestion.isScoreEnabled = true;
    }

    await this.questionRepository.create(newQuestion);
    const createdQuestion = await this.questionRepository.findOne({
      order: [orderByCreatedOn],
    });
    if (!createdQuestion) {
      throw new HttpErrors.NotFound();
    }

    if (
      [
        QuestionType.MULTI_SELECTION,
        QuestionType.SINGLE_SELECTION,
        QuestionType.DROPDOWN,
        QuestionType.SCALE,
      ].includes(question.questionType)
    ) {
      await this._createDefaultOptions(
        createdQuestion?.id ?? '',
        question.questionType,
      );
    }
    return this.findQuestionWithOptions(createdQuestion.id ?? '');
  }

  async _createFollowupQuestion(
    question: Question,
    optionId: string,
  ): Promise<Question> {
    const option = await this.optionsRepository.findOne({
      where: {
        id: optionId,
        questionId: question?.parentQuestionId ?? undefined,
      },
    });
    if (!option) {
      throw new HttpErrors.NotFound('Entity not found');
    }
    if (option.followupQuestionId) {
      throw new HttpErrors.BadRequest(
        `Option ${option.name ?? ''} already has followup question.`,
      );
    }
    await this.questionRepository.create(question);
    const createdQuestion = await this.questionRepository.findOne({
      order: [orderByCreatedOn],
    });
    if (!createdQuestion) {
      throw new HttpErrors.NotFound();
    }
    await this.optionsRepository.updateById(optionId, {
      followupQuestionId: createdQuestion.id,
    });
    if (
      [
        QuestionType.MULTI_SELECTION,
        QuestionType.SINGLE_SELECTION,
        QuestionType.DROPDOWN,
        QuestionType.SCALE,
      ].includes(question.questionType)
    ) {
      await this._createDefaultOptions(
        createdQuestion?.id ?? '',
        question.questionType,
      );
    }

    return this.findQuestionWithOptions(createdQuestion.id ?? '');
  }

  async generateQuestionUuid(questionId?: string): Promise<string> {
    const questionIdPrefix = 'QR';
    const sequenceStart = `000001`;
    if (!questionId) {
      const lastInsertedQuestion =
        await this.questionRepository.findOneIncludeSoftDelete({
          fields: {uid: true},
          order: [orderByCreatedOn],
        });
      questionId = lastInsertedQuestion?.uid;
    }

    const sequence = parseInt(
      questionId?.substring(questionIdPrefix.length, questionId?.length) ??
        sequenceStart,
    );

    return `${questionIdPrefix}${this._addLeadingZero(
      sequence + 1,
      defaultLeadingZero,
    )}`;
  }

  _addLeadingZero(number: number, size: number): string {
    let valueWithLeadingZero = number.toString();
    if (valueWithLeadingZero.length === defaultLeadingZero) {
      size += 1;
    }
    while (valueWithLeadingZero.length < size)
      valueWithLeadingZero = '0' + valueWithLeadingZero;
    return valueWithLeadingZero;
  }

  async _createDefaultOptions(
    questionId: string,
    questionType: QuestionType,
  ): Promise<void> {
    const options = [];
    const optionsInScaleType = 11;
    const noOfOptions =
      questionType === QuestionType.SCALE
        ? optionsInScaleType
        : noOfOptionsByDefault;
    for (let index = 1; index <= noOfOptions; index++) {
      if (questionType === QuestionType.SCALE) {
        options.push({
          name: '',
          displayOrder: index,
          score: index - 1,
          questionId,
        });
      } else {
        options.push({
          name: `Option ${index}`,
          displayOrder: index,
          questionId,
        });
      }
    }
    await this.optionsRepository.createAll(options);
  }

  async deleteQuestion(id: string): Promise<void> {
    const question = await this.questionRepository.findOne({
      where: {
        id,
      },
      include: [
        {
          relation: 'options',
          scope: {
            fields: {id: true, questionId: true},
          },
        },
        {
          relation: 'survey',
          scope: {
            fields: {id: true, status: true},
          },
        },
      ],
    });
    if (!question) {
      throw new HttpErrors.NotFound();
    }
    //Delete not Allowed if Question used in template
    await this.checkIfUsedInTemplateOrSurvey(id);

    await this.questionRepository.deleteById(id);
    await this._deleteAllOptionsByQuestion(question);
  }

  async _deleteAllOptionsByQuestion(question: Question): Promise<void> {
    if (question.options?.length) {
      await this.optionsRepository.deleteAllHard({
        id: {inq: question.options.map(option => option.id)},
      });
    }
  }

  async findQuestionWithOptions(questionId: string): Promise<Question> {
    return this.questionRepository.findById(questionId, {
      include: [
        {
          relation: 'options',
          scope: {
            fields: {
              id: true,
              questionId: true,
              name: true,
              displayOrder: true,
            },
            order: ['displayOrder ASC'],
          },
        },
      ],
    });
  }

  async updateQuestion(questionId: string, question: Question) {
    const {existingQuestion} = await this.checkAndGetIfAllowedQuestionToUpdate(
      questionId,
      question,
    );
    if (question.name) {
      question.name = question.name.trim();
    }

    // if previous and new question type are not same
    if (
      question.questionType &&
      existingQuestion.questionType !== question.questionType
    ) {
      await this._handleQuestionTypeChange(
        question,
        existingQuestion,
        questionId,
      );
      if (question.questionType === QuestionType.SCALE) {
        question.isScoreEnabled = true;
      }
    }

    await this.questionRepository.updateById(questionId, question);

    /* The above code is checking if a property called "isScoreEnabled" exists in the "question" object
    and if its value is false. If it is, then it updates all the options in the optionsRepository
    with a score of 0 for the given questionId. */
    if (
      question.hasOwnProperty('isScoreEnabled') &&
      question.isScoreEnabled === false
    ) {
      await this.optionsRepository.updateAll({score: 0}, {questionId});
    }
    await this.handleOnStatusChange(questionId, question);

    return this.questionRepository.findById(questionId, {include: ['options']});
  }

  async _handleQuestionTypeChange(
    question: Question,
    existingQuestion: Question,
    questionId: string,
  ) {
    // if previous or new layout is Scale or Text then delete all existing options
    if (
      [QuestionType.SCALE, QuestionType.TEXT].includes(question.questionType) ||
      [QuestionType.SCALE, QuestionType.TEXT].includes(
        existingQuestion.questionType,
      )
    ) {
      await this._deleteAllOptionsByQuestion(existingQuestion);
      await this._createDefaultOptions(questionId, question.questionType);
    }
  }

  async handleApprove(id: string) {
    await this.updateAllChildStatus(id, QuestionStatus.APPROVED);
  }

  async updateAllChildStatus(id: string, status: QuestionStatus) {
    await this.questionRepository.updateAll(
      {
        status,
      },
      {or: [{parentQuestionId: id}, {rootQuestionId: id}]},
    );
  }

  checkIfAllowedToUpdate(
    existingQuestion: Question,
    updateQuestion?: Question,
  ) {
    //Update not Allowed if Question existing status is Approved
    if (existingQuestion.status === QuestionStatus.APPROVED) {
      throw new HttpErrors.BadRequest(ErrorKeys.NotAuthorised);
    }
  }

  async checkIfUsedInTemplateOrSurvey(questionId: string) {
    const templateQuestion = await this.templateQuestionRepository.count({
      questionId,
    });
    if (templateQuestion?.count > 0) {
      throw new HttpErrors.BadRequest(
        ErrorKeys.DeleteNotAllowedForSurveyOrTemplateUsedEntity,
      );
    }
    const surveyQuestionCount = await this.surveyQuestionRepository.count({
      questionId,
    });
    if (surveyQuestionCount?.count > 0) {
      throw new HttpErrors.BadRequest(
        ErrorKeys.DeleteNotAllowedForSurveyOrTemplateUsedEntity,
      );
    }
  }

  async handleOnStatusChange(id: string, updateQuestion: Question) {
    if (updateQuestion?.status === QuestionStatus.APPROVED) {
      await this.handleApprove(id);
    } else {
      // do nothing
    }
  }

  async validateParentQuestion(parentQuestionId: string | undefined) {
    if (parentQuestionId) {
      const parentQuestion =
        await this.questionRepository.findById(parentQuestionId);
      if (!parentQuestion) {
        throw new HttpErrors.NotFound('Parent question not found');
      } else if (
        parentQuestion.followUpQuestions?.length &&
        [QuestionType.TEXT, QuestionType.SCALE].includes(
          parentQuestion.questionType,
        )
      ) {
        throw new HttpErrors.BadRequest(
          `only one child question allow for ${parentQuestion.questionType} question.`,
        );
      } else {
        // do nothing
      }
    }
  }

  async checkAndGetIfAllowedQuestionToUpdate(
    questionId: string,
    question?: Question,
  ) {
    const existingQuestion = await this.questionRepository.findOne({
      where: {
        id: questionId,
      },
      include: [
        {
          relation: 'options',
          scope: {
            fields: {id: true, questionId: true},
          },
        },
        {
          relation: 'survey',
          scope: {
            fields: {id: true, status: true},
          },
        },
      ],
    });
    if (!existingQuestion) {
      throw new HttpErrors.NotFound();
    }

    this.checkIfAllowedToUpdate(existingQuestion, question);
    return {existingQuestion};
  }
}
