interface CommandParams {
  topic: string;
  variables: any;
}

export interface ICommand<N, E extends Error> {
  parameters: CommandParams;
  execute(): Promise<N | E>;
}

class BPMNTaskCommand implements ICommand<void, BPMNTaskError> {
  parameters: CommandParams;

  constructor(params: CommandParams) {
    this.parameters = params;
  }

  async execute(): Promise<void | BPMNTaskError> {
    try {
      // do some operation here
    } catch (error) {
      throw new BPMNTaskError();
    }
  }
}

// Custom error class
// to handle BPMN task error
export class BPMNTaskError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export interface IBPMNTask<T, N> {
  command: BPMNTaskCommand;
  runTask(data: T, done?: (data?: N) => void): Promise<void>;
}

// export class BPMNTask implements IBPMNTask<BPMNParams, BPMNCb> {
//   command: BPMNTaskCommand;

//   constructor(command?: BPMNTaskCommand) {
//     if (command) {
//       this.command = command;
//     }
//   }

//   async runTask(data: BPMNParams, done?: () => void): Promise<void> {
//     if (data) {
//       this.command.parameters = data;
//     }
//     try {
//       const response = await this.command.execute();
//       if (response instanceof BPMNTaskError) {
//         throw Error('BPMN Task error');
//       }
//       if (done) {
//         done();
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
