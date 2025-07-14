import {Answers} from 'yeoman-environment';
// eslint-disable-next-line @typescript-eslint/naming-convention
import TerminalAdapter from 'yeoman-environment/lib/adapter';

export class McpAdapter extends TerminalAdapter {
  async prompt<T extends Answers>(
    questions: TerminalAdapter.Questions<T>,
    answers?: T,
    cb?: (answers: T) => void | Promise<void>,
  ) {
    this.console.error(JSON.stringify(questions, undefined, 2));
    throw Error(
      `The generator is expecting an input from prompt, please check the inputs`,
    );
  }
}
