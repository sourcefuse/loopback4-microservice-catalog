import {model, property} from '@loopback/repository';
import {SurveyQuestion} from './survey-question.model';

@model()
export class SurveyQuestionDto extends SurveyQuestion<SurveyQuestionDto> {
  @property({
    type: 'boolean',
  })
  isPredefined: boolean;
}
