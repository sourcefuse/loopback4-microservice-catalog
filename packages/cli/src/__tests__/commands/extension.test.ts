import {extensionSuite} from '../suite/extension';
import {commandTest} from '../helper/command-test.helper';
import {Extension} from '../../commands/extension';

describe('extension', () => {
  extensionSuite.forEach(testCase => {
    commandTest(testCase, Extension);
  });
});
