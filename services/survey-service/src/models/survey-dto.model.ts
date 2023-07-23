import {model, property} from '@loopback/repository';
import {Survey} from './survey.model';

@model()
export class SurveyDto extends Survey<SurveyDto> {
  @property({
    type: 'string',
  })
  createdByName?: string;
  @property({
    type: 'string',
    name: 'existing_template_id',
  })
  existingTemplateId?: string;
}

export type SurveyDtoWithRelations = SurveyDto;
