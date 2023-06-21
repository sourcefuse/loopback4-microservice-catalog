import {updateSuite} from '../suite/update';
import {commandTest} from '../helper/command-test.helper';
import {Update} from '../../commands/update';

describe('update', () => {
  updateSuite.forEach(testCase => {
    commandTest(testCase, Update);
  });
});
