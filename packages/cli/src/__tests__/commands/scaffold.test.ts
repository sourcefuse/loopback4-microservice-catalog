import {scaffoldSuite} from '../suite/scaffold';
import {commandTest} from '../helper/command-test.helper';
import {Scaffold} from '../../commands/scaffold';

describe('scaffold', () => {
  scaffoldSuite.forEach(testCase => {
    commandTest(testCase, Scaffold);
  });
});
