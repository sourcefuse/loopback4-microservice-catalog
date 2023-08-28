import {Options, Question} from '../models';
import {QuestionHelperService} from './question-helper.service';
import {injectable, BindingScope, service, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {QuestionRepository} from '../repositories';
import {OptionsRepository} from '../repositories/options.repository';
import {QuestionStatus, QuestionType} from '../enum/question.enum';
import {QuestionDuplicateDto} from '../models/question-duplicate-dto.model';
import {
  QuestionRepository as QuestionSequelizeRepo,
  OptionsRepository as OptionsSequelizeRepo,
} from '../repositories/sequelize';

const orderByCreatedOn = 'created_on DESC';
@injectable({scope: BindingScope.TRANSIENT})
export class QuestionDuplicateHelperService {
  constructor(
    @repository(QuestionRepository)
    public questionRepository: QuestionRepository | QuestionSequelizeRepo,
    @repository(OptionsRepository)
    public optionsRepository: OptionsRepository | OptionsSequelizeRepo,
    @service(QuestionHelperService)
    public questionHelperService: QuestionHelperService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  questionIdsUsed: string[] = [];

  async duplicateQuestion(
    questionId: string,
    body?: QuestionDuplicateDto,
    parentQuestionId?: string,
    rootQuestionId?: string,
    surveyId?: string,
  ) {
    const masterQuestion = await this.questionRepository.findById(questionId);
    this.checkIfQuestionCanBeDuplicated(masterQuestion, surveyId);

    const questionSequenceId = await this.getQuestionId();
    const duplicateQuestionObj = new Question({
      name: masterQuestion.name ?? '',
      uid: questionSequenceId,
      status: surveyId ? QuestionStatus.ADDED_TO_SURVEY : QuestionStatus.DRAFT,
      questionType: masterQuestion.questionType,
      isScoreEnabled: masterQuestion.isScoreEnabled,
      isFollowupEnabled: masterQuestion.isFollowupEnabled,
      validation: masterQuestion.validation,
      parentQuestionId,
      rootQuestionId: rootQuestionId,
    });
    delete body?.displayOrder;

    if (surveyId) {
      duplicateQuestionObj.surveyId = surveyId;
    }

    await this.questionRepository.create(duplicateQuestionObj);
    const createdQuestion = await this.questionRepository.findOne({
      where: {uid: questionSequenceId},
      order: [orderByCreatedOn],
    });
    if (!createdQuestion) {
      throw new HttpErrors.NotFound();
    }

    rootQuestionId = rootQuestionId ?? createdQuestion.id;

    await this.inheritOptions(
      questionId,
      createdQuestion?.id ?? '',
      rootQuestionId,
      body,
      surveyId,
    );

    if (
      masterQuestion.questionType === QuestionType.SCALE ||
      masterQuestion.questionType === QuestionType.TEXT
    ) {
      this.duplicateScaleOrTextFollowUpQuestion(
        createdQuestion?.id,
        questionId,
        body,
        rootQuestionId,
        surveyId,
      ).catch(err => this.logger.error(JSON.stringify(err)));
    }

    return this.questionHelperService.findQuestionWithOptions(
      createdQuestion.id ?? '',
    );
  }

  checkIfQuestionCanBeDuplicated(masterQuestion: Question, surveyId?: string) {
    if (
      !surveyId &&
      masterQuestion?.status !== QuestionStatus.APPROVED &&
      masterQuestion?.status !== QuestionStatus.DRAFT
    ) {
      throw new HttpErrors.UnprocessableEntity(
        "This question can't be duplicate",
      );
    }
  }

  async duplicateScaleOrTextFollowUpQuestion(
    questionId?: string,
    masterQuestionId?: string,
    body?: QuestionDuplicateDto,
    rootQuestionId?: string,
    surveyId?: string,
  ) {
    if (masterQuestionId) {
      const masterFollowUpQuestion = await this.questionRepository.find({
        where: {parentQuestionId: masterQuestionId},
      });

      if (masterFollowUpQuestion?.length) {
        const duplicateQuestionPromises = masterFollowUpQuestion.map(question =>
          this.duplicateQuestion(
            question.id ?? '',
            body,
            questionId,
            rootQuestionId,
            surveyId,
          ),
        );

        await Promise.all(duplicateQuestionPromises);
      }
    }
  }

  async inheritOptions(
    parentQuestionId: string,
    questionId: string,
    rootQuestionId?: string,
    body?: QuestionDuplicateDto,
    surveyId?: string,
  ) {
    const parentQuestionOptions = await this.optionsRepository.find({
      where: {questionId: parentQuestionId},
    });

    const options: Options[] = [];
    const optionsWithFollowUp: Options[] = [];

    parentQuestionOptions?.forEach(option => {
      if (option.followupQuestionId) {
        optionsWithFollowUp.push(option);
      } else {
        options.push(
          new Options({
            name: option.name,
            questionId,
            displayOrder: option.displayOrder,
            score: option.score,
          }),
        );
      }
    });

    if (optionsWithFollowUp?.length) {
      const duplicateQuestionPromises = optionsWithFollowUp.map(item =>
        this.duplicateQuestion(
          item.followupQuestionId ?? '',
          body,
          questionId,
          rootQuestionId,
          surveyId,
        ),
      );

      const duplicateQuestions = await Promise.all(duplicateQuestionPromises);
      optionsWithFollowUp?.forEach((option, index) => {
        options.push(
          new Options({
            name: option.name,
            questionId,
            displayOrder: option.displayOrder,
            score: option.score,
            followupQuestionId: duplicateQuestions[index].id,
          }),
        );
      });
    }

    if (options.length) {
      await this.optionsRepository.createAll(options);
    }
  }

  async getQuestionId() {
    let questionSequenceId =
      await this.questionHelperService.generateQuestionUuid();
    while (this.questionIdsUsed.includes(questionSequenceId)) {
      questionSequenceId =
        await this.questionHelperService.generateQuestionUuid(
          questionSequenceId,
        );
    }
    this.questionIdsUsed.push(questionSequenceId);
    return questionSequenceId;
  }
}
