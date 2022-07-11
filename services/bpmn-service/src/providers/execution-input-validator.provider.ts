// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {ExecutionInputValidator} from '../types';
import Ajv from 'ajv';
import {HttpErrors} from '@loopback/rest';

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
