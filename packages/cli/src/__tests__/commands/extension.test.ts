import {Extension} from '../../commands/extension';
import {commandTest} from '../helper/command-test.helper';
import {extensionSuite} from '../suite/extension';

// sonarignore:start
describe('extension', () => {
  extensionSuite.forEach(testCase => {
    commandTest(testCase, Extension);
  });
});
// sonarignore:end
