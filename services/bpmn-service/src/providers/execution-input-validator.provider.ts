﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {ExecutionInputValidator} from '../types';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Ajv from 'ajv';

export class ExecutionInputValidationProvider
  implements Provider<ExecutionInputValidator>
{
  value(): ExecutionInputValidator {
    return async (schema, input) => {
      const ajv = new Ajv();
      const validate = ajv.compile(schema);
      try {
        const valid = validate(input);
        if (valid) {
          return true;
        } else {
          throw new Error('invalid');
        }
      } catch (e) {
        throw new HttpErrors.BadRequest(JSON.stringify(validate.errors));
      }
    };
  }
}
