import {SurveyResponseDetailDto} from './survey-response-detail-dto.model';
import {Model, model, property} from '@loopback/repository';

@model()
export class SurveyResponseDto extends Model {
  @property({
    type: 'array',
    itemType: 'object',
  })
  surveyResponseDetailArray?: SurveyResponseDetailDto[];

  @property({
    type: 'string',
  })
  surveyResponderId: string;

  constructor(data?: Partial<SurveyResponseDto>) {
    super(data);
  }
}
