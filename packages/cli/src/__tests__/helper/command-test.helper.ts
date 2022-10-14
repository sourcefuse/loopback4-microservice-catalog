import Command from '@oclif/command';
import {Config} from '@oclif/config';
import {expect} from 'chai';
import {createStubInstance, stub} from 'sinon';
import Environment from 'yeoman-environment';
import {AnyObject, CommandTestCase} from '../../types';

export function commandTest(testCase: CommandTestCase, command: ICommand) {
  it(testCase.name, async () => {
    const prompt = stub();
    prompt.callsFake(async questions => {
      const output: AnyObject = {};
      questions.forEach((question: AnyObject) => {
        const promptFromCase = testCase.prompts.find(
          p => p.input.name === question.name,
        );
        if (promptFromCase) {
          output[question.name] = promptFromCase?.output;
        }
      });
      return output;
    });
    const stubEnv = createStubInstance(Environment);
    stubEnv.run.resolves();
    const scaffold = new command(
      testCase.argv ?? [],
      new Config({root: ''}),
      prompt,
      stubEnv,
    );
    await scaffold.run();
    const calls = prompt.getCalls();
    expect(calls.length).to.be.equal(testCase.prompts.length);
    for (let i = 0; i < calls.length; i++) {
      expect(calls[i].args[0][0]).to.be.deep.equal(testCase.prompts[i].input);
    }
    // get second argument of first call of env.run
    expect(stubEnv.run.getCall(0).args[1]).is.deep.equal(testCase.options);
  });
}

export type ICommand = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): Command;
};
