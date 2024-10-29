// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {fromBuffer} from 'file-type';

import {fileValidator} from '../../decorators';
import {FileUtilBindings} from '../../keys';
import {IFileRequestMetadata, IFileValidator} from '../../types';
import {MulterS3Storage} from '../storage';

@fileValidator()
export class FileTypeValidator implements IFileValidator {
  constructor(
    @inject(FileUtilBindings.FILE_REQUEST_METADATA)
    private readonly config: IFileRequestMetadata,
    @inject(FileUtilBindings.TEXT_FILE_TYPES)
    private readonly textFileTypes: string[],
  ) {}
  async validate(file: Express.Multer.File): Promise<void> {
    const ext = `.${file.originalname.split('.').pop() ?? ''}`;
    if (this.textFileTypes.includes(ext)) {
      await this._validateTextFile(file, ext);
    } else {
      await this._validateBinaryFile(file, ext);
    }
  }

  private async _validateTextFile(
    file: Express.Multer.File,
    extension: string,
  ) {
    if (this.config.extensions) {
      if (!extension || !this.config.extensions.includes(extension)) {
        throw new HttpErrors.BadRequest(`File type not allowed: ${extension}`);
      }
    }
  }

  private async _validateBinaryFile(
    file: Express.Multer.File,
    extension: string,
  ) {
    if (this.config.storageOptions?.storageClass === MulterS3Storage) {
      return;
    }
    const trueType = await fromBuffer(file.buffer);
    /**
     * Trutype gives `jpg` and we maintain whitelist as `['.jpg']`
     */
    let ext: string | undefined = trueType?.ext;
    if (ext && !ext.startsWith('.')) {
      ext = `.${ext}`;
    }

    if (this.config.extensions) {
      if (!ext || !this.config.extensions.includes(ext) || !file.mimetype) {
        throw new HttpErrors.BadRequest(`File type not allowed: ${ext}`);
      }
    }
  }
}
