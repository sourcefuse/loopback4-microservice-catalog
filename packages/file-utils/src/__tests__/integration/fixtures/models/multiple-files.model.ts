import {Entity, model, property} from '@loopback/repository';
import {fileProperty} from '../../../../decorators/file-property.decorator';

@model({
  settings: {multer: {limitsProvider: true}},
})
export class MultipleFiles extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @fileProperty({
    type: 'array',
    itemType: 'object',
  })
  files: Express.Multer.File[];

  constructor(data?: Partial<MultipleFiles>) {
    super(data);
  }
}
