import {model, property} from '@loopback/repository';
import {QuestionTemplate} from './question-template.model';

@model({settings: {strict: false}})
export class QuestionTemplatesDto extends QuestionTemplate<QuestionTemplatesDto> {
  @property({
    type: 'string',
    name: 'existing_template_id',
  })
  existingTemplateId?: string;
}
