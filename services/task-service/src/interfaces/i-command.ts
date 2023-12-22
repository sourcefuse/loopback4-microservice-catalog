import {CamundaTaskParameters} from '../types';

export interface ICommand {
  parameters: CamundaTaskParameters;
  execute(): Promise<void>;
}
