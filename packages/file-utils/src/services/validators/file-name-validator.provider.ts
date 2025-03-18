import {HttpErrors} from '@loopback/rest';

import path from 'path';
import {NAME_REGEX} from '../../constant';
import {fileValidator} from '../../decorators';
import {File, IFileValidator} from '../../types';

@fileValidator()
export class FileNameValidator implements IFileValidator {
  constructor() {}
  async validate(file: File): Promise<File> {
    await this._validateFileName(file);
    return file;
  }

  private async _validateFileName(file: Express.Multer.File) {
    const baseName = path.basename(
      file.originalname,
      path.extname(file.originalname),
    );
    if (NAME_REGEX.test(baseName)) {
      throw new HttpErrors.BadRequest(
        'File name should not contain special characters',
      );
    }
    return file;
  }
}
