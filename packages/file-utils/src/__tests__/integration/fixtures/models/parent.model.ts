import {Entity, model, property} from '@loopback/repository';
import {fileProperty} from '../../../../decorators/file-property.decorator';
import {FileTypeValidator} from '../../../../services';

@model()
export class Parent extends Entity {
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
    validators: [FileTypeValidator],
    extensions: ['.png', '.txt'],
  })
  file: string;

  constructor(data?: Partial<Parent>) {
    super(data);
  }
}

export interface ParentRelations {}
