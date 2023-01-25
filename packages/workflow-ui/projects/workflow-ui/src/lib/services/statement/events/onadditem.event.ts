import {NodeTypes, StartElementTypes} from '../../../enum';
import {BpmnEvent} from '../../../types/bpmn.types';
import {TriggerOnAddItem} from '../../bpmn/elements/tasks/trigger-on-add-item.task';

export class OnAddItemEvent extends BpmnEvent {
  groupType: NodeTypes;
  groupId: string;
  trigger = true;
  startElement = StartElementTypes.BasicStartElement;
  elements = [TriggerOnAddItem];
  name = 'On add item';
  statement = 'When an item is added';
  properties = {};
  prompts = [];
  constructor(id: string, groupType: NodeTypes, groupId: string) {
    super();
    this.id = id;
    this.groupType = groupType;
    this.groupId = groupId;
  }
}
