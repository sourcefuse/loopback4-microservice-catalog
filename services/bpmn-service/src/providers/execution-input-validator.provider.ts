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
        validate(input);
        return true;
      } catch (e) {
        throw new HttpErrors.BadRequest(JSON.stringify(validate.errors));
      }
    };
  }
}
