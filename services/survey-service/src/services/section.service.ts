import {
  injectable,
  /* inject, */
  BindingScope,
  inject,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {SurveyStatus} from '../enum/question.enum';
import {SectionRepository} from '../repositories/section.repository';
import {SurveyQuestionRepository} from '../repositories/survey-question.repository';
import {SurveyRepository} from '../repositories/survey.repository';
import {ErrorKeys} from '../enum/error-keys.enum';

@injectable({scope: BindingScope.TRANSIENT})
export class SectionService {
  constructor(
    @repository(SectionRepository)
    public sectionRepository: SectionRepository,
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  async handleDeleteSection(surveyId: string, sectionId: string) {
    const existingSections = await this.sectionRepository.find({
      where: {surveyId},
    });
    const sectionToDelete = existingSections.find(
      existingSection => existingSection.id === sectionId,
    );

    /*
      For example — Section 1 = 20 questions, Section 2 = 30 questions, Section 3 = 10 questions 
      case1: If user removes section 1 - 
      Section 2 = 50 questions
      Section 3 = 10 questions 

      case2: If user removes section 2 - 
      Section 1 = 20 questions
      Section 3 = 40 questions 

      case3: If user removes section 3 - 
      Section 1 = 20 questions
      Section 2 = 40 questions
    */
    if (!sectionToDelete?.displayOrder) {
      throw new HttpErrors.BadRequest(ErrorKeys.DisplayOrderMissing);
    }
    let sectionIdToUpdate;
    if (existingSections.length > 1) {
      const orderOfSectionToUpdate =
        sectionToDelete.displayOrder < existingSections.length
          ? sectionToDelete.displayOrder + 1
          : sectionToDelete.displayOrder - 1;
      sectionIdToUpdate = existingSections.find(
        existingSection =>
          existingSection.displayOrder === orderOfSectionToUpdate,
      )?.id;
    }

    this.surveyQuestionRepository
      .updateAll({sectionId: sectionIdToUpdate}, {sectionId})
      .catch(err => this.logger.error(JSON.stringify(err)));
    this.sectionRepository
      .reorder(surveyId, sectionToDelete.displayOrder)
      .catch(err => this.logger.error(JSON.stringify(err)));
  }

  async checkBasicSectionValidation(surveyId: string) {
    const survey = await this.surveyRepository.findById(surveyId, {
      fields: {id: true, status: true},
    });
    if (survey.status !== SurveyStatus.DRAFT) {
      throw new HttpErrors.BadRequest();
    }
  }
}
