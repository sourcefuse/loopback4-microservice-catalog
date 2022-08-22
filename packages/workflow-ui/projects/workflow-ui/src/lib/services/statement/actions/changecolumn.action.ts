import {ChangeColumnValue} from '../../bpmn/elements/tasks/change-column-value.task';
import {ToColumnInput} from '../inputs/tocolumn.input';
import {ToValueInput} from '../inputs/tovalue.input';
import {BpmnAction} from '../../../types/bpmn.types';

export class ChangeColumnValueAction extends BpmnAction {
  elements = [ChangeColumnValue];
  name = 'Change Column Value';
  statement = 'change ';
  prompts = [ToColumnInput, ToValueInput];
  constructor(id: string) {
    super();
    this.id = id;
  }
}
