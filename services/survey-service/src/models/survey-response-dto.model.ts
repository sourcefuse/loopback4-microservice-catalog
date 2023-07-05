import {SurveyResponseDetailDto} from './survey-response-detail-dto.model';
import {AnyObject, Model, model, property} from '@loopback/repository';

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
    name: 'ext_id',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
  })
  extMetadata?: AnyObject;

  constructor(data?: Partial<SurveyResponseDto>) {
    super(data);
  }
}
