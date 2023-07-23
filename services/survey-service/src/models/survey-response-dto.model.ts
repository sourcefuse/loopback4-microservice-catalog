import {AnyObject, model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';
import {SurveyResponseDetailDto} from './survey-response-detail-dto.model';

@model()
export class SurveyResponseDto extends CoreModel<SurveyResponseDto> {
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
}
