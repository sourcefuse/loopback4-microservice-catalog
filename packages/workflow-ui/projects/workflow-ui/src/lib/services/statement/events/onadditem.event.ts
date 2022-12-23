import { NodeTypes } from '../../../enum';
import { BpmnEvent } from '../../../types/bpmn.types';
import { GatewayElement } from '../../bpmn/elements/gateways/gateway.element';
import { ReadColumnValue } from '../../bpmn/elements/tasks/read-column.task';
import { TriggerOnAddItem } from '../../bpmn/elements/tasks/trigger-on-add-item.task';
import { ColumnInput } from '../inputs/column.input';
import { ConditionInput } from '../inputs/condition.input';
import { ValueInput } from '../inputs/value.input';

export class OnAddItemEvent extends BpmnEvent {
  groupType: NodeTypes;
  groupId: string;
  trigger = true;
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
