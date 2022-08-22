import {BpmnAction} from '../../../types/bpmn.types';
import {SendEmail} from '../../bpmn/elements/tasks/send-email.task';
import {
  EmailBodyInput,
  EmailSubjectInput,
  EmailToInput,
} from '../inputs/email.input';

export class SendEmailAction extends BpmnAction {
  elements = [SendEmail];
  name = 'Send Email';
  statement = 'send email';
  prompts = [EmailToInput, EmailSubjectInput, EmailBodyInput];
  constructor(id: string) {
    super();
    this.id = id;
  }
}
