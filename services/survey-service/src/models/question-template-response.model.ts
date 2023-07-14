import {model, property} from '@loopback/repository';
import {QuestionTemplate} from './question-template.model';

@model({settings: {strict: false}})
export class QuestionTemplateResponse extends QuestionTemplate {
  @property({
    type: 'string',
  })
  createdByName?: string;

  constructor(data?: Partial<QuestionTemplateResponse>) {
    super(data);
  }
}
