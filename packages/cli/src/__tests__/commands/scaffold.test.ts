// sonarignore:start
import {Scaffold} from '../../commands/scaffold';
import {commandTest} from '../helper/command-test.helper';
import {scaffoldSuite} from '../suite/scaffold';

describe('scaffold', () => {
  scaffoldSuite.forEach(testCase => {
    commandTest(testCase, Scaffold);
  });
});
// sonarignore:end
