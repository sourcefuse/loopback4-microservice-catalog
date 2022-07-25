import {ColumnInput} from './column.input';

/* `ColumnInput` is a `WorkflowPrompt` that prompts the user to select a column from a list of columns */
export class ToColumnInput extends ColumnInput {
  suffix = 'to';
}
