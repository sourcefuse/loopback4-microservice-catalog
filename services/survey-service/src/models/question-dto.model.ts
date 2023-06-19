import {Model, model, property} from '@loopback/repository';
import {QuestionStatus, QuestionType} from '../enum/question.enum';

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
    jsonSchema: {
      enum: [...Object.values(QuestionStatus), null],
    },
  })
  status?: QuestionStatus;

  constructor(data?: Partial<QuestionDto>) {
    super(data);
  }
}
