// eslint-disable-next-line @typescript-eslint/naming-convention
import Environment, {createEnv} from 'yeoman-environment';
import {AnyObject} from '../types';
import {McpAdapter} from './mcp-adapter';
export async function yeomanRun(
  workspace: string,
  name: string,
  args: string[] | undefined,
  opts: AnyObject,
) {
  const env = getEnv(workspace, name);
  await runWithEnv(env, name, args, opts);
}

function getEnv(workspace: string, name: string) {
  const env = createEnv([], {cwd: workspace}, new McpAdapter({}));
  registerGenerators(env, name);
  return env;
}

async function runWithEnv(
  env: Environment,
  name: string,
  args: string[] | undefined,
  opts: AnyObject,
) {
  const yeomanArgs: [string, ...string[]] = [`sl:${name}`, ...(args ?? [])];
  return env.run(yeomanArgs, opts);
}

function registerGenerators(env: Environment, generator: string) {
  env.register(
    require.resolve(`../generators/${generator}/index`),
    `sl:${generator}`,
  );
}
