import {Getter, extensionPoint, extensions, inject} from '@loopback/core';
import {FileUtilBindings, FileValidatorExtensionPoint} from '../keys';
import {
  FileValidatorWithConstructor,
  getConfigProperty,
  IFileRequestMetadata,
  ParsedMultipartData,
} from '../types';

@extensionPoint(FileValidatorExtensionPoint.key)
export class FileValidatorService {
  constructor(
    @extensions()
    private readonly validatorGetter: Getter<FileValidatorWithConstructor[]>,
    @inject(FileUtilBindings.FILE_REQUEST_METADATA)
    private readonly metadata: IFileRequestMetadata,
  ) {}
  async validateParsedData(
    parsed: ParsedMultipartData,
  ): Promise<Express.Multer.File | undefined> {
    const {file} = parsed;
    if (!file) {
      return file;
    }
    const validators = await this.validatorGetter();
    const applicable = getConfigProperty(this.metadata, 'validators', file);
    let newFile = file;
    let filteredValidators = validators;
    if (applicable) {
      filteredValidators = validators.filter(validator =>
        applicable.includes(validator.constructor),
      );
    }
    for (const validator of filteredValidators) {
      newFile = await validator.validate(newFile);
    }
    return newFile;
  }
}
