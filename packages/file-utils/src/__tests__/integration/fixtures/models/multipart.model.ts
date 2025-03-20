import {Entity, model} from '@loopback/repository';
import {fileProperty} from '../../../../decorators/file-property.decorator';
import {FileTypeValidator} from '../../../../services';
import {ClamAVValidator} from '../../../../sub-packages';

@model()
export class MultipartModel extends Entity {
  @fileProperty({
    type: 'array',
    itemType: 'string',
    validators: [FileTypeValidator, ClamAVValidator],
    extensions: ['.pdf', '.txt', '.png'],
  })
  files: Express.Multer.File;

  constructor(data?: Partial<MultipartModel>) {
    super(data);
  }
}
