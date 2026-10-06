// eslint-disable-next-line @typescript-eslint/naming-convention
import type Environment from 'yeoman-environment';
import {AnyObject} from '../types';

// In MCP / non-interactive mode a generator must never block waiting for stdin.
// yeoman-environment 6 moved TerminalAdapter into the ESM-only @yeoman/adapter
// package (not require()-able from this CommonJS CLI), so instead of subclassing
// the adapter we override prompt on the environment's own adapter.
export class McpAdapter {
  install(env: Environment): void {
    env.adapter.prompt = this.prompt as typeof env.adapter.prompt;
  }

  prompt(questions: AnyObject): Promise<never> {
    // sonarignore:start
    console.error(JSON.stringify(questions, undefined, 2));
    // sonarignore:end
    return Promise.reject(
      new Error(
        `The generator is expecting an input from prompt, please check the inputs`,
      ),
    );
  }
}
