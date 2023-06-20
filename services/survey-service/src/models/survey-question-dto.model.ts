import {model, property} from '@loopback/repository';
import {SurveyQuestion} from './survey-question.model';

@model()
export class SurveyQuestionDto extends SurveyQuestion {
  @property({
    type: 'boolean',
  })
  isPredefined: boolean;

  constructor(data?: Partial<SurveyQuestionDto>) {
    super(data);
  }
}
