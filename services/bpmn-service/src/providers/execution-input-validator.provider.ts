// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {ExecutionInputValidator} from '../types';

import Ajv from 'ajv';

export class ExecutionInputValidationProvider
  implements Provider<ExecutionInputValidator>
{
  /**
   * The function `value` returns an asynchronous input validator that uses Ajv to validate input
   * against a schema and throws an error if validation fails.
   * @returns An asynchronous function that acts as an execution input validator. The function uses the
   * Ajv library to compile and validate input data against a given schema. If the input is valid, the
   * function returns `true`. If the input is invalid, it throws an error with a message indicating the
   * validation errors.
   */
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
        throw new HttpErrors.BadRequest(
          `JSON.stringify(validate.errors) ${e.message}`,
        );
      }
    };
  }
}
