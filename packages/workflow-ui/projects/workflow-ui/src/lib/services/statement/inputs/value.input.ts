import {State, WorkflowListPrompt} from '../../../classes';
import {InputTypes} from '../../../enum';
import {RecordOfAnyType} from '../../../types';

export class ValueInput extends WorkflowListPrompt {
  prefix: string | {state: string} = '';
  suffix = '';
  inputKey = 'value';
  listNameField = 'text';
  listValueField = 'value';
  placeholder = 'Value';

  // setListName = <S extends RecordOfAnyType>(state: State<S>) => {
  //   return state.get('listName') ?? this.listNameField;
  // };

  // setListValue = <S extends RecordOfAnyType>(state: State<S>) => {
  //   return state.get('listValue') ?? this.listValueField;
  // };

  prevchange = <S extends RecordOfAnyType>(state: State<S>) => {
    state.remove('value');
    state.remove('valueName');
  };
  options = <S extends RecordOfAnyType>(state: State<S>) =>
    state.get('values') as [];
  typeFunction = <S extends RecordOfAnyType>(state: State<S>) =>
    state.get('valueInputType') as InputTypes;
}
