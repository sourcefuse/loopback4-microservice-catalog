import {ChangeColumnValue} from '../../bpmn/elements/tasks/change-column-value.task';
import {ToColumnInput} from '../inputs/tocolumn.input';
import {ToValueInput} from '../inputs/tovalue.input';
import {BpmnAction} from '../../../types/bpmn.types';
import {NodeTypes} from '../../../enum';

export class ChangeColumnValueAction extends BpmnAction {
  isElseAction: boolean;
  groupType: NodeTypes;
  groupId: string;
  elements = [ChangeColumnValue];
  name = 'Change Column Value';
  statement = 'change ';
  prompts = [ToColumnInput, ToValueInput];
  constructor(
    id: string,
    groupType: NodeTypes,
    groupId: string,
    isElseAction: boolean,
  ) {
    super();
    this.id = id;
    this.groupType = groupType;
    this.groupId = groupId;
    this.isElseAction = isElseAction || false;
  }
}
