import {flags} from '@oclif/command';
import Base from '../command-base';
import {UpdateOptions} from '../generators/update/types/types';

export class Update extends Base<UpdateOptions> {
  static description = 'update the dependencies of a loopback project';

  static flags = {
    help: flags.boolean({
      name: 'help',
      description: 'show manual pages',
      type: 'boolean',
    }),
  };

  async run() {
    const input = this.parse(Update);
    await super.generate('update', {
      help: input.flags.help,
    });
  }
}
