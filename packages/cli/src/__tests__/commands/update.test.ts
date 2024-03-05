import {Update} from '../../commands/update';
import {commandTest} from '../helper/command-test.helper';
import {updateSuite} from '../suite/update';

// sonarignore:start
describe('update', () => {
  updateSuite.forEach(testCase => {
    commandTest(testCase, Update);
  });
});
// sonarignore:end
