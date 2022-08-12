import {Model, model, property} from '@loopback/repository';
import {TextType} from '../types';

@model({
  name: 'translate-model-dto',
})
export class TranslateModelDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  text: string | number;
  @property({
    type: 'string',
    required: true,
  })
  targetLanguage: string;
  @property({
    jsonSchema: {
      enum: [TextType.HTML, TextType.MARKDOWN, TextType.TEXT],
    },
    required: true,
  })
  type: TextType;
}
