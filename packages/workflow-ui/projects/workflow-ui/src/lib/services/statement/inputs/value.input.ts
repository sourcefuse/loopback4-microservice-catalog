import {State, WorkflowListPrompt} from '../../../classes';
import {InputTypes} from '../../../enum';
import {RecordOfAnyType} from '../../../types';

/* `ColumnInput` is a `WorkflowPrompt` that prompts the user to set a value for a column,
 * it's type changes according to the column selected
 */
export class ValueInput extends WorkflowListPrompt {
  prefix: string | {state: string} = '';
  suffix = '';
  inputKey = 'value';
  listNameField = 'text';
  listValueField = 'value';
  placeholder = 'Value';
  prevchange = <S extends RecordOfAnyType>(state: State<S>) => {
    state.remove('value');
    state.remove('valueName');
  };
  options = <S extends RecordOfAnyType>(state: State<S>) =>
    state.get('values') as [];
  typeFunction = <S extends RecordOfAnyType>(state: State<S>) =>
    state.get('valueInputType') as InputTypes;
}
