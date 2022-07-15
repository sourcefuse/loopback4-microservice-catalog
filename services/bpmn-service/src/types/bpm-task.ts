// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IBPMTask, ICommand} from './types';

export class BPMTask<T, R> implements IBPMTask<T, R> {
  constructor(cmd?: ICommand) {
    if (cmd) {
      this.command = cmd;
    }
  }

  command: ICommand;

  operation(data: T, done?: (data: R) => void): void {
    if (data) {
      this.command.parameters = data;
    }
    this.command.execute().then(
      (resp: R) => {
        if (done) {
          done(resp);
        }
      },
      err => {
        console.error(err); //NOSONAR
      },
    );
  }
}
