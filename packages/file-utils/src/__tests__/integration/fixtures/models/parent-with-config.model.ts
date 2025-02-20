import {Entity, model, property} from '@loopback/repository';
import {fileProperty} from '../../../../decorators/file-property.decorator';

@model({
  settings: {multer: {limitsProvider: true}},
})
export class ParentWithConfig extends Entity {
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
    type: 'string',
  })
  file: string;

  constructor(data?: Partial<ParentWithConfig>) {
    super(data);
  }
}
