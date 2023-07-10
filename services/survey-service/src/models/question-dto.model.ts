import {AnyObject, Model, model, property} from '@loopback/repository';
import {QuestionType} from '../enum/question.enum';

@model()
export class QuestionDto extends Model {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  questionType: QuestionType;

  @property({
    type: 'string',
    required: false,
  })
  rootQuestionId?: string;

  @property({
    type: 'string',
    required: false,
  })
  parentQuestionId?: string;

  @property({
    type: 'string',
    required: false,
  })
  optionId?: string;

  @property({
    type: 'string',
    required: false,
  })
  surveyId?: string;

  @property({
    type: 'string',
    required: false,
  })
  status?: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 1000,
    },
  })
  name?: string;

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

  constructor(data?: Partial<QuestionDto>) {
    super(data);
  }
}
