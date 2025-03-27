import {extensionPoint, extensions, Getter, inject} from '@loopback/core';
import {FileUtilBindings, FileValidatorExtensionPoint} from '../keys';
import {
  FileValidatorWithConstructor,
  getConfigProperty,
  IFileRequestMetadata,
  ParsedMultipartData,
  ValidationResult,
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
  ): Promise<ValidationResult | undefined> {
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
    const waiters: Promise<string | null>[] = [];
    for (const validator of filteredValidators) {
      const result = await validator.validate(newFile);
      newFile = result.file;
      if (result.waiter) {
        waiters.push(result.waiter);
      }
    }
    return {
      file: newFile,
      waiters,
    };
  }
}
