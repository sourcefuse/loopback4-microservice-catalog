import {Survey} from './survey.model';
import {model, property} from '@loopback/repository';

@model()
export class SurveyDto extends Survey {
  @property({
    type: 'string',
  })
  createdByName?: string;
  @property({
    type: 'string',
    name: 'existing_template_id',
  })
  existingTemplateId?: string;

  constructor(data?: Partial<SurveyDto>) {
    super(data);
  }
}

export type SurveyDtoWithRelations = SurveyDto;
