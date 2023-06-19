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

  @property({
    type: 'string',
  })
  vendorId?: string;

  @property({
    type: 'string',
  })
  domainId?: string;

  @property({
    type: 'string',
  })
  businessUnitId?: string;

  constructor(data?: Partial<SurveyResponseDto>) {
    super(data);
  }
}
