import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {fromStream} from 'file-type';

import {PassThrough} from 'stream';
import {fileValidator} from '../../decorators';
import {FileUtilBindings} from '../../keys';
import {File, IFileValidator, MulterConfig} from '../../types';

@fileValidator()
export class FileTypeValidator implements IFileValidator {
  constructor(
    @inject(FileUtilBindings.TEXT_FILE_TYPES)
    private readonly textFileTypes: string[],
    @inject(FileUtilBindings.MulterConfig, {optional: true})
    private readonly uploadOptionsGetter: MulterConfig,
  ) {}
  async validate(file: File): Promise<File> {
    const ext = `.${file.originalname.split('.').pop() ?? ''}`;

    if (this.textFileTypes.includes(ext)) {
      await this._validateTextFile(file, ext);
    } else {
      return this._validateBinaryFile(file, ext);
    }
    return file;
  }

  private async _validateTextFile(
    file: Express.Multer.File,
    extension: string,
  ) {
    const validExtensions = this.uploadOptionsGetter.configFor(
      'extensions',
      file,
    );
    if (validExtensions) {
      if (!extension || !validExtensions.includes(extension)) {
        throw new HttpErrors.BadRequest(`File type not allowed: ${extension}`);
      }
    }
  }

  private async _validateBinaryFile(file: File, extension: string) {
    const validExtensions = this.uploadOptionsGetter.configFor(
      'extensions',
      file,
    );

    const cloneStream = new PassThrough();
    file.stream.pipe(cloneStream);
    try {
      const trueType = await fromStream(cloneStream);
      /**
       * Trutype gives `jpg` and we maintain whitelist as `['.jpg']`
       */
      let ext: string | undefined = trueType?.ext;
      if (ext && !ext.startsWith('.')) {
        ext = `.${ext}`;
      }

      if (validExtensions) {
        if (!ext || !validExtensions.includes(ext) || !file.mimetype) {
          throw new HttpErrors.BadRequest(`File type not allowed: ${ext}`);
        }
      }
      return file;
    } catch (error) {
      cloneStream.destroy();
      throw error;
    }
  }
}
