import { SurveyQuestion } from './survey-question.model';
import {model, property} from '@loopback/repository';

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

