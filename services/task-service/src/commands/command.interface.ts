export interface ICommand {
  parameters: any;
  execute(): Promise<any>;
}
