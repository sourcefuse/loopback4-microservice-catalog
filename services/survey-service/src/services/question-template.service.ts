import {BindingScope, injectable} from '@loopback/core';
import {AnyObject, Count, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ErrorKeys} from '../enum/error-keys.enum';
import {QuestionTemplateStatus} from '../enum/template.enum';
import {QuestionTemplatesDto} from '../models/question-template-dto.model';
import {QuestionTemplate} from '../models/question-template.model';
import {TemplateQuestion} from '../models/template-questions.model';
import {QuestionTemplateRepository} from '../repositories/question-template.repository';
import {TemplateQuestionRepository} from '../repositories/template-questions.repository';

const defaultLeadingZero = 6;
const orderByCreatedOn = 'created_on DESC';

@injectable({scope: BindingScope.TRANSIENT})
export class QuestionTemplateService {
  constructor(
    @repository(QuestionTemplateRepository)
    public questionTemplateRepository: QuestionTemplateRepository,
    @repository(TemplateQuestionRepository)
    public templateQuestionRepository: TemplateQuestionRepository,
  ) {}

  async createTemplate(questionTemplate: Omit<QuestionTemplatesDto, 'id'>) {
    questionTemplate.status = QuestionTemplateStatus.DRAFT;
    const exisitingTemplateId = questionTemplate?.existingTemplateId;

    // create questionTemplate
    if (questionTemplate?.existingTemplateId) {
      const existingQuestionTemplate =
        await this.questionTemplateRepository.findOne({
          fields: ['isEnableWeight'],
          where: {id: questionTemplate.existingTemplateId},
        });
      if (!existingQuestionTemplate) {
        throw new HttpErrors.NotFound('Invalid reference Id');
      }
      if (existingQuestionTemplate?.isEnableWeight) {
        questionTemplate.isEnableWeight = true;
      }
    }
    const questionTemplateId = await this.generateQuestionnaireId();
    questionTemplate.uid = questionTemplateId;
    delete questionTemplate?.existingTemplateId;
    await this.questionTemplateRepository.create(questionTemplate);

    // fetch createdTemplate with id
    const createdTemplate = await this.questionTemplateRepository.findOne({
      order: [orderByCreatedOn],
      where: {
        uid: questionTemplateId,
      },
    });
    if (!createdTemplate) {
      throw new HttpErrors.NotFound();
    }

    // add templateQuestions
    if (exisitingTemplateId) {
      const existingQuestions = await this.templateQuestionRepository.find({
        where: {templateId: exisitingTemplateId},
      });
      existingQuestions?.forEach(existingQuestion => {
        delete existingQuestion.createdOn;
        delete existingQuestion.createdBy;
        delete existingQuestion.modifiedBy;
        delete existingQuestion.modifiedOn;
        delete existingQuestion.id;
        existingQuestion.templateId = createdTemplate.id as string;
      });
      await this.templateQuestionRepository.createAll(existingQuestions);
      await this.addDependentOnQuestionId(
        createdTemplate.id as string,
        existingQuestions,
      );
    }
    return createdTemplate;
  }

  async updateModifiedByAndOn(templateId: string) {
    await this.questionTemplateRepository.updateById(templateId, {
      id: templateId,
    });
  }

  separateIdsToAddAndRemove(
    dataArray: AnyObject[],
    dataKey: string,
    requestedIds: string[],
  ) {
    const currentIds = dataArray.map(d => d[dataKey]);
    const toAddIds = requestedIds.filter(id => !currentIds.includes(id));
    const toDeleteIds = currentIds.filter(id => !requestedIds.includes(id));
    return {
      toAddIds,
      toDeleteIds,
    };
  }

  async checkDeleteValidation(templateId: string) {
    const template = await this.questionTemplateRepository.findOne({
      where: {
        id: templateId,
      },
    });

    if (!template) {
      throw new HttpErrors.NotFound('Entity not found');
    }
  }

  async deleteRelatedObjects(templateId: string) {
    // delete related questions
    const questionnaireQuestions = await this.templateQuestionRepository.find({
      where: {templateId},
      fields: ['id'],
    });
    if (questionnaireQuestions.length) {
      await this.templateQuestionRepository.deleteAllHard({
        id: {
          inq: questionnaireQuestions.map(
            questionnaireQuestion => questionnaireQuestion.id,
          ),
        },
      });
    }
  }

  async generateQuestionnaireId(): Promise<string> {
    const templateIdPrefix = 'QT';
    const sequenceStart = `000001`;
    const lastInsertedTemplate =
      await this.questionTemplateRepository.findOneIncludeSoftDelete({
        fields: ['uid'],
        order: [orderByCreatedOn],
      });

    const sequence = parseInt(
      lastInsertedTemplate?.uid?.substring(
        templateIdPrefix.length,
        lastInsertedTemplate?.uid?.length,
      ) ?? sequenceStart,
    );

    return `${templateIdPrefix}${this._addLeadingZero(
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

  /*
    existingTemplateId: to copy questions from
    templateId: to copy questions to
  */
  async addTemplateQuestions(existingTemplateId: string, templateId: string) {
    try {
      const existingQuestions = await this.templateQuestionRepository.find({
        where: {templateId: existingTemplateId},
      });
      existingQuestions?.forEach(existingQuestion => {
        delete existingQuestion.createdOn;
        delete existingQuestion.createdBy;
        delete existingQuestion.modifiedBy;
        delete existingQuestion.modifiedOn;
        existingQuestion.templateId = templateId;
      });

      await this.templateQuestionRepository.createAll(existingQuestions);

      await this.addDependentOnQuestionId(templateId, existingQuestions);
    } catch (err) {
      throw new HttpErrors.InternalServerError(err);
    }
  }

  async addDependentOnQuestionId(
    templateId: string,
    existingTemplateQuestions: TemplateQuestion[],
  ) {
    const createdQuestionnaireQuestions =
      await this.templateQuestionRepository.find({
        where: {templateId},
      });
    const updatePromiseArr: Promise<Count>[] = [];
    existingTemplateQuestions?.forEach(existingTemplateQuestion => {
      if (existingTemplateQuestion.dependentOnQuestionId) {
        const oldTemplateQuestion = existingTemplateQuestions.find(
          templateQuestionObj =>
            templateQuestionObj.id ===
            existingTemplateQuestion.dependentOnQuestionId,
        );

        const newTemplateQuestion = createdQuestionnaireQuestions.find(
          createdTemplateQuestion =>
            createdTemplateQuestion.questionId ===
            oldTemplateQuestion?.questionId,
        );

        updatePromiseArr.push(
          this.templateQuestionRepository.updateAll(
            {
              dependentOnQuestionId: newTemplateQuestion?.id,
            },
            {
              questionId: existingTemplateQuestion?.questionId,
              templateId: newTemplateQuestion?.templateId,
            },
          ),
        );
      }
    });
    await Promise.all(updatePromiseArr);
  }

  async updateTemplate(
    templateId: string,
    questionTemplate: QuestionTemplatesDto,
  ) {
    const existingQuestionTemplate =
      await this.questionTemplateRepository.findOne({
        where: {id: templateId},
      });
    if (!existingQuestionTemplate) {
      throw new HttpErrors.NotFound();
    }
    questionTemplate.id = templateId;
    this.checkIfAllowedToUpdate(existingQuestionTemplate);

    if (questionTemplate.existingTemplateId) {
      const referenceQuestionTemplate =
        await this.questionTemplateRepository.count({
          id: questionTemplate.existingTemplateId,
        });
      if (!referenceQuestionTemplate.count) {
        throw new HttpErrors.NotFound('Invalid reference Id');
      }

      // sonarignore:start
      this.addTemplateQuestions(questionTemplate.existingTemplateId, templateId)
        .then()
        .catch(err => Promise.reject(err));
      // sonarignore:end
    }
    const updatedCount = await this.questionTemplateRepository.updateAll(
      questionTemplate,
      {
        id: templateId,
      },
    );
    if (updatedCount.count === 0) {
      throw new HttpErrors.BadRequest('Entity not found.');
    }
    // sonarignore:start
    this.updateModifiedByAndOn(templateId).catch(err => Promise.reject(err));
    // sonarignore:end
  }

  private checkIfAllowedToUpdate(existingQuestionnaire: QuestionTemplate) {
    //Update not Allowed if Template existing status is Approved
    if (existingQuestionnaire.status === QuestionTemplateStatus.APPROVED) {
      throw new HttpErrors.BadRequest(ErrorKeys.NotAuthorised);
    }
  }

  async checkIfAllowedTemplateQuestionToUpdate(templateId: string) {
    const existingQuestionTemplate =
      await this.questionTemplateRepository.findOne({
        where: {id: templateId},
        fields: {id: true, status: true, createdBy: true},
      });
    if (!existingQuestionTemplate) {
      throw new HttpErrors.NotFound();
    }

    //Update Allowed if Questionnaire status is in DRAFT
    if (existingQuestionTemplate.status === QuestionTemplateStatus.DRAFT) {
      return true;
    }
    throw new HttpErrors.BadRequest(ErrorKeys.NotAuthorised);
  }
}
