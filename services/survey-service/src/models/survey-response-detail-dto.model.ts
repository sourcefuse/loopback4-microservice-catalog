import {model, property} from '@loopback/repository';

@model()
export class SurveyResponseDetailDto {
  @property({
    type: 'string',
    name: 'question_id',
    required: true,
  })
  questionId: string;

  @property({
    type: 'object',
    required: true,
  })
  answer: {optionId: string; optionIds?: string[]; text?: string};

  @property({
    type: 'string',
    jsonSchema: {
      maximum: 100,
      minimum: 0,
    },
  })
  score?: number;
}
