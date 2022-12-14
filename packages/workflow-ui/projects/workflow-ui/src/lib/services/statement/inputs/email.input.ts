import {State, WorkflowPrompt} from '../../../classes';
import {ConditionTypes, InputTypes} from '../../../enum';
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

// export class EmailSubjectInput extends WorkflowPrompt {
//   prefix = 'with subject: ';
//   suffix = 'and';
//   typeFunction = () => InputTypes.Text;
//   inputKey = 'subject';
//   placeholder = 'Subject';
// }

// export class EmailBodyInput extends WorkflowPrompt {
//   prefix = 'to';
//   suffix = '';
//   typeFunction = () => InputTypes.List;
//   inputKey = 'body';
//   placeholder = 'someone';
// }
