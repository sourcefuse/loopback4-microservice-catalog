import {NodeTypes} from '../../../enum';
import {BpmnAction} from '../../../types/bpmn.types';

export class ReadColumnValueAction extends BpmnAction {
  isElseAction: boolean;
  groupType: NodeTypes;
  groupId: string;
  elements = [];
  name = 'Read Column Value';
  statement = 'read value from ';
  prompts = [];
  constructor(id: string, groupType: NodeTypes, groupId: string, isElseAction: boolean) {
    super();
    this.id = id;
    this.groupType = groupType;
    this.groupId = groupId;
    this.isElseAction = isElseAction || false;
  }
}
