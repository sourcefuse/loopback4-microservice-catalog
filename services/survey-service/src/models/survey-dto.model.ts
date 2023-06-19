import {Survey} from './survey.model';
import {model, property} from '@loopback/repository';

@model()
export class SurveyDto extends Survey {
  constructor(data?: Partial<SurveyDto>) {
    super(data);
  }
}

export interface SurveyDtoRelations {}

export type SurveyDtoWithRelations = SurveyDto & SurveyDtoRelations;
