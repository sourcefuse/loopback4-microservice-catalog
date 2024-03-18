import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {SurveyQuestion, SurveyQuestionDto} from '../models';
import {SurveyQuestionRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyQuestionService {
  constructor(
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,
  ) {}

  async createSurveyQuestion(
    surveyId: string,
    surveyQuestionDto: Omit<SurveyQuestionDto, 'id'>,
  ): Promise<SurveyQuestion> {
    const orderByCreatedOn = 'created_on DESC';
    const {...surveyQuestion} = surveyQuestionDto;

    surveyQuestion.surveyId = surveyId;
    await this.surveyQuestionRepository.create(surveyQuestion);

    // fetch createdSurveyQuestion with id
    const createdSurveyQuestion = await this.surveyQuestionRepository.findOne({
      order: [orderByCreatedOn],
      where: {
        surveyId,
      },
    });
    if (!createdSurveyQuestion) {
      throw new HttpErrors.NotFound();
    }

    return createdSurveyQuestion;
  }
}
