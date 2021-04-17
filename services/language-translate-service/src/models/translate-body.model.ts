import {Entity, model, property} from '@loopback/repository';
import {TextType} from '../types';

@model({
  name: 'translate-model-dto',
})
export class TranslateModelDto extends Entity {
  @property({
    type: 'string',
  })
  text: string | number;
  @property({
    type: 'string',
  })
  targetLanguage: string;
  @property({
    jsonSchema: {
      enum: [TextType.HTML, TextType.MARKDOWN, TextType.TEXT],
    },
  })
  type: TextType;
}
