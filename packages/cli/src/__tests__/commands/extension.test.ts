// sonarignore:start
import {Extension} from '../../commands/extension';
import {commandTest} from '../helper/command-test.helper';
import {extensionSuite} from '../suite/extension';

describe('extension', () => {
  extensionSuite.forEach(testCase => {
    commandTest(testCase, Extension);
  });
});
// sonarignore:end
