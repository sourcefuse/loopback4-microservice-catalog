import {ValueInput} from './value.input';
import {State, WorkflowPrompt} from '../../../classes';
import {InputTypes} from '../../../enum';
import {RecordOfAnyType} from '../../../types/base.types';

export class EmailDataInput extends WorkflowPrompt {
  prefix = '';
  suffix = '';
  typeFunction = () => InputTypes.Email;
  inputKey = 'email';
  placeholder = 'Email';
}

export class EmailToInput extends WorkflowPrompt {
  prefix = 'to';
  suffix = '';
  placeholder = 'someone';
  inputKey = 'emailTo';
  listNameField = 'text';
  listValueField = 'value';
  prevchange = <S extends RecordOfAnyType>(state: State<S>) => {};
  options = <S extends RecordOfAnyType>(state: State<S>) =>
    state.get('emailToValues') as [];
  typeFunction = <S extends RecordOfAnyType>(state: State<S>) =>
    state.get('emailToInputType') as InputTypes;
}

export class EmailRecepientInput extends ValueInput {
  inputKey = 'specificRecepient';
}
