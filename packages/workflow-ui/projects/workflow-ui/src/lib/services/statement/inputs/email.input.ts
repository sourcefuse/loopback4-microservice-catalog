import {WorkflowPrompt} from '../../../classes';
import {InputTypes} from '../../../enum';

/* `ColumnInput` is a `WorkflowPrompt` that prompts the user to input the `to` field of an email */
export class EmailToInput extends WorkflowPrompt {
  prefix = 'to';
  suffix = '';
  typeFunction = () => InputTypes.Text;
  inputKey = 'email';
  placeholder = 'Email Address';
}

/* `ColumnInput` is a `WorkflowPrompt` that prompts the user to input the `subject` field of an email */
export class EmailSubjectInput extends WorkflowPrompt {
  prefix = 'with subject: ';
  suffix = 'and';
  typeFunction = () => InputTypes.Text;
  inputKey = 'subject';
  placeholder = 'Subject';
}

/* `ColumnInput` is a `WorkflowPrompt` that prompts the user to input the `body` field of an email */
export class EmailBodyInput extends WorkflowPrompt {
  prefix = 'with body: ';
  suffix = '';
  typeFunction = () => InputTypes.Text;
  inputKey = 'body';
  placeholder = 'Body';
}
