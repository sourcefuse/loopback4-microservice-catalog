import {State, WorkflowPrompt} from '../../../classes';
import {InputTypes} from '../../../enum';
import {RecordOfAnyType} from '../../../types';

export class IntervalInput extends WorkflowPrompt {
  prefix = '';
  suffix = '';
  typeFunction = () => InputTypes.List;
  inputKey = 'interval';
  listNameField = 'text';
  listValueField = 'value';
  placeholder = 'Interval';
  options = <S extends RecordOfAnyType>(state: State<S>) =>
    state.get('intervalList');
}
