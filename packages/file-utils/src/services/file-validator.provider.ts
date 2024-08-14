// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, extensionPoint, extensions} from '@loopback/core';
import {FileValidatorExtensionPoint} from '../keys';
import {IFileValidator, ParsedMultipartData} from '../types';

@extensionPoint(FileValidatorExtensionPoint.key)
export class FileValidatorService {
  constructor(
    @extensions()
    private validatorGetter: Getter<IFileValidator[]>,
  ) {}
  async validateParsedData(parsed: ParsedMultipartData): Promise<void> {
    const {file} = parsed;
    if (!file) {
      return;
    }
    const validators = await this.validatorGetter();
    for (const validator of validators) {
      await validator.validate(file);
    }
  }
}
