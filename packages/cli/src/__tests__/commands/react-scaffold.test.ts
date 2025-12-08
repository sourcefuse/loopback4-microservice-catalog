// sonarignore:start
import {Config} from '@oclif/config';
import {assert, expect} from 'chai';
import {createStubInstance, stub} from 'sinon';
import Environment from 'yeoman-environment';
import {ReactScaffold} from '../../commands/react/scaffold';

const DEFAULT_FLAGS = [
  '--templateRepo',
  'sourcefuse/react-boilerplate-ts-ui',
  '--templateVersion',
  'main',
  '--localPath',
  './template',
];

type RunOptions = Record<string, unknown>;

describe('react scaffold', () => {
  it('throws an error when project name is not provided', async () => {
    const prompt = stub().resolves({name: ''});
    const env = createStubInstance(Environment);
    env.run.callsFake(
      async (_namespace: string | string[], options?: RunOptions) => {
        const name = (options?.name as string | undefined) ?? '';
        if (name.trim().length === 0) {
          throw new Error('Project name is required');
        }
      },
    );
    const command = new ReactScaffold(
      [...DEFAULT_FLAGS],
      new Config({root: ''}),
      prompt,
      env,
    );

    let error: Error | undefined;
    try {
      await command.run();
    } catch (err) {
      error = err as Error;
    }

    assert.isTrue(prompt.calledOnce);
    assert.isTrue(env.run.calledOnce);
    assert.exists(error);
    assert.include(error?.message ?? '', 'Project name is required');
  });

  it('runs successfully when project name is provided', async () => {
    const prompt = stub().resolves({});
    const env = createStubInstance(Environment);
    env.run.callsFake(
      async (_namespace: string | string[], options?: RunOptions) => {
        const name = options?.name as string;
        expect(name).to.equal('react-ui');
      },
    );
    const command = new ReactScaffold(
      ['react-ui', ...DEFAULT_FLAGS],
      new Config({root: ''}),
      prompt,
      env,
    );

    await command.run();

    assert.isFalse(prompt.called);
    assert.isTrue(env.run.calledOnce);
  });
});
// sonarignore:end
