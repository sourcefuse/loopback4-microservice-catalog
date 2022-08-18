import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({settings: {strict: false}})
export class AttachmentFileDto extends UserModifiableEntity {
  @property({
    type: 'array',
    itemType: 'any',
    required: true,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachmentFiles: any[]; //NOSONAR

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any; //NOSONAR

  constructor(data?: Partial<AttachmentFileDto>) {
    super(data);
  }
}
