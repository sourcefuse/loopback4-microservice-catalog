import {State, WorkflowPrompt} from '../../../classes';
import {InputTypes} from '../../../enum';
import {RecordOfAnyType} from '../../../types';

/* `ColumnInput` is a `WorkflowPrompt` that prompts the user to select a column from a list of columns */
export class ColumnInput extends WorkflowPrompt {
  prefix = '';
  suffix = '';
  typeFunction = () => InputTypes.List;
  inputKey = 'column';
  listNameField = 'text';
  listValueField = 'value';
  placeholder = 'Column';
  options = <S extends RecordOfAnyType>(state: State<S>) =>
    state.get('columns');
}
