import {NodeTypes} from '../../../enum';
import {BpmnAction} from '../../../types/bpmn.types';
import {SendEmail} from '../../bpmn/elements/tasks/send-email.task';
import {
  EmailBodyInput,
  EmailSubjectInput,
  EmailToInput,
} from '../inputs/email.input';

export class SendEmailAction extends BpmnAction {
  isElseAction: boolean;
  groupType: NodeTypes;
  groupId: string;
  elements = [SendEmail];
  name = 'Send Email';
  statement = 'send email';
  prompts = [EmailToInput, EmailSubjectInput, EmailBodyInput];
  constructor(id: string, groupType: NodeTypes, groupId: string, isElseAction: boolean) {
    super();
    this.id = id;
    this.groupType = groupType;
    this.groupId = groupId;
    this.isElseAction = isElseAction || false;
  }
}
