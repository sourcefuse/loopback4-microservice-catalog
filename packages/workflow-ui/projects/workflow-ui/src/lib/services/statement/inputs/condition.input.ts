import {State, WorkflowPrompt} from '../../../classes';
import {InputTypes} from '../../../enum';
import {RecordOfAnyType} from '../../../types';

export class ConditionInput extends WorkflowPrompt {
  prefix = 'is';
  suffix = {
    state: 'conditionSuffix',
  };
  typeFunction = () => InputTypes.List;
  inputKey = 'condition';
  listNameField = 'text';
  listValueField = 'value';
  placeholder = 'Condition';
  prevchange = <S extends RecordOfAnyType>(state: State<S>) => {
    state.remove('conditions');
    state.remove('conditionName');
    state.remove('value');
    state.remove('valueName');
    state.remove('conditionSuffix');
  };
  options = (state: State<RecordOfAnyType>) => state.get('conditions');
}
