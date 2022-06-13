import {microservicePromptsSuite} from '../suite/microservice-prompts';
import {microserviceOptionsSuite} from '../suite/microservice-options';
import {commandTest} from '../helper/command-test.helper';
import {Microservice} from '../../commands/microservice';

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
