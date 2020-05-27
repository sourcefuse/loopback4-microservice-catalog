/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICommand {
  parameters?: any;
  execute(): Promise<any>;
}
