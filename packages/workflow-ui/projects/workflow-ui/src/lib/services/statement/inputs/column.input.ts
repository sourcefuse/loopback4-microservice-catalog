import {State, WorkflowPrompt} from '../../../classes';
import {InputTypes} from '../../../enum';
import {RecordOfAnyType} from '../../../types';

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
