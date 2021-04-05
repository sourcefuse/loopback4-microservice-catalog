import {Provider} from '@loopback/context';
import {ExecutionInputValidator} from '../types';
import Ajv from 'ajv';

export class ExecutionInputValidationProvider
  implements Provider<ExecutionInputValidator> {

  value(): ExecutionInputValidator {
    return async (schema, input) => {
      const ajv = new Ajv();
      const validate = ajv.compile(schema);
      const isValidated = validate(input);
      if (!isValidated) {
        throw validate.errors; //NOSONAR
      } else {
        return true;
      }
    };
  }
}
