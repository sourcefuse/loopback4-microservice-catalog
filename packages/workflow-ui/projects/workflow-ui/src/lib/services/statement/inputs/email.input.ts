import {WorkflowPrompt} from '../../../classes';
import {InputTypes} from '../../../enum';

export class EmailToInput extends WorkflowPrompt {
  prefix = 'to';
  suffix = '';
  typeFunction = () => InputTypes.Text;
  inputKey = 'email';
  placeholder = 'Email Address';
}

export class EmailSubjectInput extends WorkflowPrompt {
  prefix = 'with subject: ';
  suffix = 'and';
  typeFunction = () => InputTypes.Text;
  inputKey = 'subject';
  placeholder = 'Subject';
}

export class EmailBodyInput extends WorkflowPrompt {
  prefix = 'with body: ';
  suffix = '';
  typeFunction = () => InputTypes.Text;
  inputKey = 'body';
  placeholder = 'Body';
}
