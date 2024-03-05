import {Microservice} from '../../commands/microservice';
import {commandTest} from '../helper/command-test.helper';
import {microserviceOptionsSuite} from '../suite/microservice-options';
import {microservicePromptsSuite} from '../suite/microservice-prompts';

// sonarignore:start
describe('microservice', () => {
  describe('with options', () => {
    microserviceOptionsSuite.forEach(testCase => {
      commandTest(testCase, Microservice);
    });
  });
  describe('with prompts', () => {
    microservicePromptsSuite.forEach(testCase => {
      commandTest(testCase, Microservice);
    });
  });
});
// sonarignore:end
